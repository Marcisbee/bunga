import { useStore } from 'exome/react';
import { useLayoutEffect, useRef } from 'react';

import { Edge } from '../../store/edges/edge';
import { moveStore } from '../../store/move.store';
import { store } from '../../store/store';
import { cc } from '../../utils/class-names';

import { GenericEdgeComponent } from './components/generic-edge/generic-edge.component';
import style from './edge.module.scss';

interface EdgeComponentProps {
  edge: Edge;
}

export function EdgeComponent({ edge }: EdgeComponentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y, width } = useStore(edge.position);
  const { selectedEdges, selectEdge, startMouseMove, selectedAll } = useStore(moveStore);

  const isActive = selectedEdges.indexOf(edge) > -1;

  useLayoutEffect(() => {
    edge.position.setHeight(ref.current!.offsetHeight);
    store.activeSpace!.boundary.updateBoundary();
  }, []);

  return (
    <div
      ref={ref}
      className={cc([
        style.edge,
        isActive && style.active,
      ])}
      onClick={(e) => {
        // Stop bubbling to top canvas.
        e.stopPropagation();

        if (!e.shiftKey) {
          if (!moveStore.didMouseMove) {
            selectEdge(edge, e.shiftKey);
          }

          return;
        }

        selectEdge(edge, e.shiftKey);
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.shiftKey) {
          return;
        }

        if (selectedAll.length <= 1) {
          selectEdge(edge, e.shiftKey);
        }

        startMouseMove(e.pageX, e.pageY);
      }}
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
        width,
      }}
      tabIndex={0}
    >
      <GenericEdgeComponent edge={edge} />
    </div>
  );
}
