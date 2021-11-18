import { useStore } from 'exome/react';

import { ActionStore, ActionStyleStore } from '../../store/action.store';
import { cc } from '../../utils/class-names';

import styles from './edge.module.scss';

interface EdgeComponentProps {
  action: ActionStore;
}

export function EdgeComponent({ action }: EdgeComponentProps) {
  const { position } = useStore(action);
  const { x, y, width } = useStore(position);

  const startX = x + width + 17;
  const startY = y + 41;

  return (
    <>
      <g
        className={cc([
          styles.edge,
          action instanceof ActionStyleStore && styles.styleEdge,
        ])}
      >
        <path
          d={`M${startX},${startY} C${startX + 100},${startY} 100,200 200,200`}
          className={styles.path}
          markerEnd="none"
        />
      </g>
    </>
  );
}
