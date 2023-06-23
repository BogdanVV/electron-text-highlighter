import { useEffect, useRef, useState } from 'react';
import { BrowserViewContainer, HighlightsContainer } from '@components';
import { Highlight } from '@types';
import './App.css';
const { ipcRenderer } = window.require('electron');

function App() {
  const [url, setUrl] = useState<string>('');
  const [isUrlLoadingError, setIsUrlLoadingError] = useState<boolean>(false);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const urlInputRef = useRef<HTMLInputElement | null>(null);

  const onUrlGo = (url: string) => {
    setIsUrlLoadingError(false);
    ipcRenderer.send('browserview:go-to-url', url);
    urlInputRef.current?.blur();
  };

  const getHighlights = () => {
    ipcRenderer.send('get-highlights');
  };

  const onHighlightDelete = (id: number) => {
    ipcRenderer.send('delete-highlight', id);
    getHighlights();
  };

  useEffect(() => {
    getHighlights();
    ipcRenderer.on('browserview:url-loading-error', () => {
      setIsUrlLoadingError(true);
    });
    ipcRenderer.on('receive-highlights', (_, arg) => {
      setHighlights(arg);
    });

    // I assume there's no need to remove those listeners in return callback
    // since App component is meant to be unmounted only when the app gets closed
  }, []);

  return (
    <div className='app-container'>
      <HighlightsContainer
        highlights={highlights}
        onHighlightDelete={onHighlightDelete}
        onUrlClick={onUrlGo}
      />
      <BrowserViewContainer
        url={url}
        setUrl={setUrl}
        onUrlGo={onUrlGo}
        urlInputRef={urlInputRef}
        isUrlLoadingError={isUrlLoadingError}
      />
    </div>
  );
}

export default App;
