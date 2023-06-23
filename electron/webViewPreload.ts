import { ipcRenderer } from 'electron';

let highlightedText = '';
const saveBtnId = 'saveBtn';
const saveBtnHoverClass = 'saveBtnHover';

document.addEventListener('selectionchange', () => {
  const selectedText = document.getSelection()?.toString();
  highlightedText = selectedText || '';
  const saveBtn = document.getElementById(saveBtnId);
  if (saveBtn || (saveBtn && !highlightedText)) {
    saveBtn.remove();
  }
});

document.addEventListener('mouseup', (e) => {
  ipcRenderer.send(
    'on-highlight-finish',
    JSON.stringify({ x: e.clientX, y: e.clientY })
  );

  if (highlightedText) {
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save highlight';
    saveBtn.id = saveBtnId;
    saveBtn.setAttribute(
      'style',
      `padding-top: 10px; padding-bottom: 10px; padding-left: 15px; padding-right: 15px; z-index: 1000; background-color: #526D82; position: fixed; top: ${
        e.clientY + 20
      }px; left: ${
        e.clientX - 40
      }px; border-radius: 999px; border: 2px solid #27374D; cursor: pointer;`
    );
    saveBtn.className = saveBtnHoverClass;
    const hoverStyleForSaveBtn = `.${saveBtnHoverClass}:hover { background-color: #27374D !important; }`;
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(hoverStyleForSaveBtn));
    saveBtn.onclick = () => {
      ipcRenderer.send('save-highlight', highlightedText);
      highlightedText = '';
      document.getSelection()?.empty();
      saveBtn.remove();
    };
    const html = document.getElementsByTagName('html')[0];
    html.append(saveBtn);
    const head = document.getElementsByTagName('head')[0];
    head.append(style);
  } else {
    const saveBtn = document.getElementById(saveBtnId);
    if (saveBtn) {
      saveBtn.remove();
    }
  }
});
