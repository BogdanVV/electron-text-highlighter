import { HighlightItem } from '@components';
import { Highlight } from '@types';
import classes from './HighlightsContainer.module.css';

type Props = {
  highlights: Highlight[];
  onHighlightDelete: (id: number) => void;
  onUrlClick: (url: string) => void;
};

export const HighlightsContainer = ({
  highlights,
  onHighlightDelete,
  onUrlClick,
}: Props) => {
  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <h2 className={classes.title}>Your highlights</h2>
      </div>
      <div className={classes.itemsContainer}>
        {highlights.length === 0 ? (
          <p>You have not saved any highlights yet</p>
        ) : (
          highlights.map((h) => (
            <HighlightItem
              onHighlightDelete={onHighlightDelete}
              key={h.id}
              item={h}
              onUrlClick={onUrlClick}
            />
          ))
        )}
      </div>
    </div>
  );
};
