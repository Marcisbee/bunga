import { onAction } from 'exome';
import { useStore } from 'exome/react';
import { useLayoutEffect, useRef } from 'react';

import { Edge } from '../../store/edges/edge';
import { EdgePositionSilent } from '../../store/edges/position';
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
  const {
    selectedEdges,
    selectEdge,
    startMouseMove,
  } = useStore(store.activeProject!.activeSpace.move);

  const isActive = selectedEdges.indexOf(edge) > -1;

  useLayoutEffect(() => {
    edge.position.setHeight(ref.current!.offsetHeight);
    store.activeProject!.activeSpace.boundary.updateBoundary();

    const unsubscribe = onAction(EdgePositionSilent, 'moveTo', (instance) => {
      if (instance !== edge.position.silent) {
        return;
      }

      ref.current!.style.transform = `translate(${instance.x}px, ${instance.y}px)`;
    });

    return () => {
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      className={cc([
        style.edge,
        isActive && style.active,
      ])}
      onClick={(e) => {
        // Stop bubbling to top canvas.
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        // Stop bubbling to top canvas.
        e.stopPropagation();

        if (e.button > 0) {
          return;
        }

        if (e.shiftKey) {
          const selected = selectEdge(edge, e.shiftKey);

          if (selected) {
            startMouseMove(e.pageX, e.pageY);
          }
          return;
        }

        if (isActive) {
          startMouseMove(e.pageX, e.pageY);
          return;
        }

        selectEdge(edge, e.shiftKey);
        startMouseMove(e.pageX, e.pageY);
      }}
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
        width,
      }}
    >
      <GenericEdgeComponent edge={edge} />
    </div>
  );
}
