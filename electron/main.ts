import { app, BrowserWindow, BrowserView, ipcMain } from 'electron';
import path from 'node:path';
import isDev from 'electron-is-dev';
import Store, { Schema } from 'electron-store';
import { StoreSchema } from '@types';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist');
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

require('@electron/remote/main').initialize();

async function createWindow() {
  // ==========================================
  // BROWSERWINDOW
  // ==========================================
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
    simpleFullscreen: true,
  });
  if (isDev) {
    win.webContents.openDevTools();
  }

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }

  // ==========================================
  // BROWSERVIEW
  // ==========================================
  const view = new BrowserView({
    webPreferences: {
      preload: path.join(__dirname, 'webViewPreload.js'),
    },
  });
  win.addBrowserView(view);
  view.setBounds({ x: 600, y: 85, width: 595, height: 700 });
  view.webContents.loadURL('https://electronjs.org');
  view.setAutoResize({
    vertical: true,
    horizontal: true,
  });
  if (isDev) {
    view.webContents.openDevTools();
  }

  // ==========================================
  // STORE
  // ==========================================
  const schema: Schema<StoreSchema> = {
    highlights: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          text: { type: 'string' },
          originUrl: { type: 'string' },
        },
        required: ['id', 'originUrl', 'text'],
      },
      default: [],
    },
  };
  const store = new Store<StoreSchema>({ schema });

  // ==========================================
  // EVENTS
  // ==========================================
  // let highlightedText = '';

  ipcMain.on('browserview:go-to-url', (_, url) => {
    view.webContents.loadURL(url).catch(() => {
      win?.webContents.send('browserview:url-loading-error');
    });
  });
  ipcMain.on('save-highlight', (_, highlightedText) => {
    const existingHighlights = store.get('highlights');
    const newHighlight = {
      id: +new Date(),
      text: highlightedText,
      originUrl: view.webContents.getURL(),
    };
    store.set('highlights', [...existingHighlights, newHighlight]);
    const highlights = store.get('highlights');
    win?.webContents.send('receive-highlights', highlights);
  });
  ipcMain.on('get-highlights', (e) => {
    const highlights = store.get('highlights');
    e.reply('receive-highlights', highlights);
  });
  ipcMain.on('delete-highlight', (_, id) => {
    const highlights = store.get('highlights');
    store.set(
      'highlights',
      highlights.filter((h) => h.id !== id)
    );
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    win = null;
  }
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  createWindow();
});
