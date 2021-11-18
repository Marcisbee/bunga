import { getExomeId } from 'exome';
import { useStore } from 'exome/react';

import { ActionConnectionStore, ActionStore, ActionStyleStore } from '../../store/action.store';
import { ElementStore } from '../../store/element.store';
import { cc } from '../../utils/class-names';

import styles from './edge.module.scss';

interface EdgeConnectionComponentProps {
  action: ActionStore;
  connection: ActionConnectionStore;
}

function EdgeConnectionComponent({ action, connection }: EdgeConnectionComponentProps) {
  const { from, to } = useStore(connection);
  const { x, y, width } = useStore(from.position);

  const startX = x + width + 17;
  const startY = y + 41;

  return (
    <g
      className={cc([
        styles.edge,
        action instanceof ActionStyleStore && styles.styleEdge,
      ])}
    >
      {to.map((end) => {
        const rect = (end as ElementStore).getDomOffset();
        const endX = rect.x;
        const endY = rect.y + (rect.height / 2);

        return (
          <path
            key={`con-end-${getExomeId(end)}`}
            d={`M${startX},${startY} C${startX + 100},${startY} ${endX - 100},${endY} ${endX},${endY}`}
            className={styles.path}
            markerEnd="none"
          />
        );
      })}
    </g>
  );
}

interface EdgeComponentProps {
  action: ActionStore;
}

export function EdgeComponent({ action }: EdgeComponentProps) {
  const { connections } = useStore(action);

  return (
    <>
      {connections.map((connection) => (
        <EdgeConnectionComponent
          key={`con-${getExomeId(connection)}`}
          action={action}
          connection={connection}
        />
      ))}
    </>
  );
}
