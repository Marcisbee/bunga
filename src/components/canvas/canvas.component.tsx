import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import { useLayoutEffect, useRef, useState } from 'react';
// @ts-ignore
import TinyGesture from 'tinygesture';
import { moveStore, SelectionStore } from '../../store/move.store';

import { SpaceStore } from '../../store/space.store';
import { store } from '../../store/store';
import { ComponentComponent } from '../component/component.component';
import { ConnectionComponent } from '../connection/connection.component';
import { EdgeComponent } from '../edge/edge.component';

import styles from './canvas.module.scss';

interface CanvasComponentProps {
  space: SpaceStore;
}

// @DEBUG: This is a debug component that renders the canvas boundaries.
function DebugBoundary({ space }: CanvasComponentProps) {
  const { x, y, width, height } = useStore(space.boundary);

  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 2,
        left: x,
        top: y,
        width,
        height,
        boxShadow: 'inset 0 0 0 1px orangered',
      }}
    >
      <span
        style={{
          position: 'absolute',
          marginTop: -20,
          color: 'orangered',
          fontSize: 12,
          whiteSpace: 'nowrap',
        }}
      >
        {JSON.stringify({ x, y, w: width, h: height })}
      </span>
    </div>
  );
}

function CanvasSelectionComponent({ selection }: { selection: SelectionStore }) {
  const ref = useRef<SVGSVGElement>(null);
  const rootPosition = useRef({ x: 0, y: 0 });

  const {
    isSelecting,
    rootX,
    rootY,
    firstX,
    firstY,
    secondX,
    secondY,
  } = useStore(selection);

  const shouldSkip = !isSelecting || (firstX === firstY && secondX === secondY);

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();

    rootPosition.current.x = rect.x;
    rootPosition.current.y = rect.y;
  }, [shouldSkip]);

  if (shouldSkip) {
    return null;
  }

  let startX: number;
  let endX: number;

  if (firstX < secondX) {
    startX = firstX;
    endX = secondX;
  } else {
    startX = secondX;
    endX = firstX;
  }

  let startY: number;
  let endY: number;

  if (firstY < secondY) {
    startY = firstY;
    endY = secondY;
  } else {
    startY = secondY;
    endY = firstY;
  }

  return (
    <svg
      ref={ref}
      className={styles.selection}
    >
      <rect
        x={startX + 0.5 - rootPosition.current.x}
        y={startY + 0.5 - rootPosition.current.y}
        width={endX - startX}
        height={endY - startY}
        strokeWidth={0.5}
        rx={2}
      />
    </svg>
  );
}

export function CanvasComponent({ space }: CanvasComponentProps) {
  const canvas = useRef<HTMLDivElement>(null);
  const canvasRoot = useRef<HTMLDivElement>(null);
  const svgRoot = useRef<SVGGElement>(null);

  const [centerModifier, setCenterModifier] = useState<[number, number]>([0, 0]);

  const { moveAllBy, reset, save, selection } = useStore(moveStore);
  const { position, components, edges } = useStore(space);
  const { resetPosition } = useStore(position);

  useLayoutEffect(() => {
    const target = canvasRoot.current!;

    function handler() {
      setCenterModifier([target.offsetLeft, target.offsetTop]);
    }

    handler();

    window.addEventListener('resize', handler, { passive: true });

    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);

  useLayoutEffect(() => {
    const gesture = new TinyGesture(canvas.current, {
      mouseSupport: false,
    });

    function setCanvasStylePosition(x: string, y: string) {
      canvas.current!.style.backgroundPosition = `${x} ${y}`;
      canvasRoot.current!.style.transform = `translate(${position.x}px, ${position.y}px)`;
      svgRoot.current!.style.transform = `translate(${position.x + centerModifier[0]}px, ${position.y + centerModifier[1]}px)`;
    }

    const handler = (e: WheelEvent) => {
      e.preventDefault()

      if (selection.isSelecting) {
        e.stopPropagation();
        return;
      }

      position.x -= e.deltaX
      position.y -= e.deltaY

      const x = `${position.x}px`;
      const y = `${position.y}px`;

      setCanvasStylePosition(x, y);
    }

    const handlerMove = () => {
      if (selection.isSelecting) {
        return;
      }

      const x = `${position.x + gesture.touchMoveX}px`;
      const y = `${position.y + gesture.touchMoveY}px`;

      setCanvasStylePosition(x, y);
    }

    const handlerMoveEnd = () => {
      position.x += gesture.touchMoveX;
      position.y += gesture.touchMoveY;
    }

    canvas.current!.addEventListener('wheel', handler);

    gesture.on('panmove', handlerMove);
    gesture.on('panend', handlerMoveEnd);

    return () => {
      canvas.current!.removeEventListener('wheel', handler);
      gesture.destroy();
    };
  }, [centerModifier[0], centerModifier[1]]);

  return (
    <div
      ref={canvas}
      className={styles.canvas}
      style={{
        backgroundPosition: `${position.x}px ${position.y}px`,
      }}
      onMouseDown={(e) => {
        if (!e.shiftKey) {
          reset();
        } else {
          save();
        }

        const root = canvasRoot.current!.getBoundingClientRect();

        selection.startSelection(root.x, root.y, e.pageX, e.pageY);
      }}
      onKeyDown={(e) => {
        const modifier = e.shiftKey ? 30 : 10;

        if (!e.key.startsWith('Arrow')) {
          return;
        }

        if (e.key === 'ArrowUp') {
          moveAllBy(0, -modifier);
        }

        if (e.key === 'ArrowDown') {
          moveAllBy(0, modifier);
        }

        if (e.key === 'ArrowLeft') {
          moveAllBy(-modifier, 0);
        }

        if (e.key === 'ArrowRight') {
          moveAllBy(modifier, 0);
        }

        e.preventDefault();
        e.stopPropagation();
        store.activeSpace!.boundary.updateBoundary();
      }}
    >
      <CanvasSelectionComponent
        selection={selection}
      />

      <div
        style={{
          display: 'block',
          position: 'fixed',
          right: 10,
          bottom: 10,
        }}
      >
        <button
          onClick={resetPosition}
        >
          Reset position
        </button>
      </div>

      <div
        ref={canvasRoot}
        id="canvasRoot"
        className={styles.root}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        {/* <DebugBoundary space={space} /> */}
        <div className={styles.container}>
          {components.map((component) => (
            <ComponentComponent
              key={`canvas-${component.id}`}
              component={component}
            />
          ))}
          {edges.map((edge) => (
            <EdgeComponent
              key={`edge-${getExomeId(edge)}`}
              edge={edge}
            />
          ))}
        </div>
      </div>

      <svg className={styles.connections}>
        {/* <defs>
          <marker
            className="react-flow__arrowhead"
            id="react-flow__arrowclosed"
            markerWidth="12.5"
            markerHeight="12.5"
            viewBox="-10 -10 20 20"
            orient="auto"
            refX="0"
            refY="0"
          >
            <polyline stroke="#b1b1b7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" fill="#b1b1b7" points="-5,-4 0,0 -5,4 -5,-4"></polyline>
          </marker>
          <marker
            className="react-flow__arrowhead"
            id="react-flow__arrow"
            markerWidth="12.5"
            markerHeight="12.5"
            viewBox="-10 -10 20 20"
            orient="auto"
            refX="0"
            refY="0"
          >
            <polyline stroke="#b1b1b7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" fill="none" points="-5,-4 0,0 -5,4"></polyline>
          </marker>
        </defs> */}
        <g
          ref={svgRoot}
          style={{
            transform: `translate(${position.x + centerModifier[0]}px, ${position.y + centerModifier[1]}px)`,
          }}
        >
          {edges.map((edge) => (
            <ConnectionComponent
              key={`edge-c-${getExomeId(edge)}`}
              edge={edge}
            />
          ))}

          {/* <g className="react-flow__edge react-flow__edge-default animated">
            <path d="M630,37 C676,37 676,201.5 722,201.5" className="react-flow__edge-path" marker-end="none"></path>
          </g>
          <g className="react-flow__edge react-flow__edge-default animated">
            <path d="M580,182 C651,182 651,201.5 722,201.5" className="react-flow__edge-path" marker-end="none"></path>
          </g> */}
          {/* <g className="react-flow__edge react-flow__edge-default animated">
            <path d="M0,0 C100,0 100,200 200,200" className="react-flow__edge-path" markerEnd="none"></path>
          </g> */}
        </g>
      </svg>
    </div>
  );
}
