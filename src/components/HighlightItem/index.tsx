import { Highlight } from '@types';
import dayjs from 'dayjs';
import classes from './HighlightItem.module.css';
import classNames from 'classnames';

type Props = {
  item: Highlight;
  onHighlightDelete: (id: number) => void;
  onUrlClick: (url: string) => void;
};

export const HighlightItem = ({
  item,
  onHighlightDelete,
  onUrlClick,
}: Props) => {
  const trimmedUrl = item.originUrl.replace('https://www.', '');
  return (
    <div className={classes.container}>
      <button
        onClick={() => onHighlightDelete(item.id)}
        className={classes.deleteButton}
      >
        x
      </button>
      <p className={classes.info}>
        {dayjs(item.id).format('DD/MM/YYYY HH:mm')}
      </p>
      <p
        className={classNames(classes.url, classes.info)}
        onClick={() => onUrlClick(item.originUrl)}
      >
        {trimmedUrl.length >= 25 ? trimmedUrl.substring(0, 25) : trimmedUrl}
      </p>
      <p className={classes.text}>{item.text}</p>
    </div>
  );
};
