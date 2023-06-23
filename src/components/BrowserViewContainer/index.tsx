import { Dispatch, RefObject, SetStateAction } from 'react';
import classes from './BrowserViewContainer.module.css';
import classNames from 'classnames';

type Props = {
  url: string;
  setUrl: Dispatch<SetStateAction<string>>;
  onUrlGo: (url: string) => void;
  urlInputRef: RefObject<HTMLInputElement>;
  isUrlLoadingError: boolean;
};

export const BrowserViewContainer = ({
  url,
  setUrl,
  onUrlGo,
  urlInputRef,
  isUrlLoadingError,
}: Props) => {
  // not the best way for controlling input since each keystroke
  // invokes rerender but I didn't have enough time to implement it properly,
  // maybe even using react-hook-form or smth
  return (
    <div className={classes.container}>
      <input
        ref={urlInputRef}
        className={classNames({
          [classes.urlInput]: true,
          [classes.urlInputError]: isUrlLoadingError,
        })}
        placeholder='Enter URL'
        value={url}
        onChange={(e) =>
          setUrl(() =>
            e.target.value.startsWith('https://')
              ? e.target.value
              : `https://${e.target.value}`
          )
        }
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onUrlGo(url);
          }
        }}
      />
      <button onClick={() => onUrlGo(url)} type='submit'>
        GO
      </button>
    </div>
  );
};
