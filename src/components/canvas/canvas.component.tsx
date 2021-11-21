import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import { useLayoutEffect, useRef, useState } from 'react';
// @ts-ignore
import TinyGesture from 'tinygesture';

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

export function CanvasComponent({ space }: CanvasComponentProps) {
  const canvas = useRef<HTMLDivElement>(null);
  const canvasRoot = useRef<HTMLDivElement>(null);
  // const canvasRoot2 = useRef<HTMLDivElement>(null);
  const svgRoot = useRef<SVGGElement>(null);

  const [centerModifier, setCenterModifier] = useState<[number, number]>([0, 0]);

  const { position, components, edges } = useStore(space);
  const { resetPosition } = useStore(position);
  const { setActive } = useStore(store.activeSpace!.activeComponent!);

  useLayoutEffect(() => {
    const target = canvasRoot.current!;
    // const target2 = canvasRoot2.current!;

    function handler() {
      setCenterModifier([target.offsetLeft, target.offsetTop]);
      // setCenterModifier([target2.offsetLeft, target2.offsetTop]);
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
      // canvasRoot2.current!.style.transform = `translate(${position.x}px, ${position.y}px)`;
      svgRoot.current!.style.transform = `translate(${position.x + centerModifier[0]}px, ${position.y + centerModifier[1]}px)`;
    }

    const handler = (e: WheelEvent) => {
      e.preventDefault()

      position.x -= e.deltaX
      position.y -= e.deltaY

      const x = `${position.x}px`;
      const y = `${position.y}px`;

      setCanvasStylePosition(x, y);
    }

    const handlerMove = () => {
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
      onClick={() => {
        setActive(null);
      }}
    >
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

      {/* <div
        ref={canvasRoot2}
        className={styles.root}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          zIndex: 1,
        }}
      >
        <div className={styles.container}>
          {components.map((component) => (
            <ComponentComponent
              key={`canvas-${component.id}`}
              component={component}
            />
          ))}
        </div>
      </div> */}

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
