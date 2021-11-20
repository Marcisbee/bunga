import { useStore } from 'exome/react';

import { Edge } from '../../store/edges/edge';
import { VariableEdge } from '../../store/edges/variable.edge';
import { store } from '../../store/store';
import { cc } from '../../utils/class-names';

import { GenericEdgeComponent } from './components/generic-edge/generic-edge.component';
import style from './edge.module.scss';

interface EdgeComponentProps {
  edge: Edge;
}

export function EdgeComponent({ edge }: EdgeComponentProps) {
  const { x, y, width, height, moveTo } = useStore(edge.position);
  // const { active, setActive } = useStore(store.activeSpace!.activeComponent!);

  // const isActive = active === action;

  return (
    <>
      <div
        className={cc([
          style.edge,
          // isActive && activeStyle,
        ])}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // setActive(action);
        }}
        style={{
          transform: `translate3d(${x}px, ${y}px, 0)`,
          width,
          // height,
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          const modifier = e.shiftKey ? 30 : 10;

          if (!e.key.startsWith('Arrow')) {
            return;
          }

          if (e.key === 'ArrowUp') {
            moveTo(x, y - modifier);
          }

          if (e.key === 'ArrowDown') {
            moveTo(x, y + modifier);
          }

          if (e.key === 'ArrowLeft') {
            moveTo(x - modifier, y);
          }

          if (e.key === 'ArrowRight') {
            moveTo(x + modifier, y);
          }

          e.preventDefault();
          e.stopPropagation();
          store.activeSpace!.boundary.updateBoundary();
        }}
      >
        <GenericEdgeComponent edge={edge} />
      </div>
    </>
  );
}
