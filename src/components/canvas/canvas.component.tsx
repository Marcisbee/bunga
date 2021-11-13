import { useStore } from 'exome/react';
import { useLayoutEffect, useRef } from 'react';
// @ts-ignore
import TinyGesture from 'tinygesture';

import { SpaceStore } from '../../store/space.store';
import { store } from '../../store/store';
import { ComponentComponent } from '../component/component.component';

import { canvasContainerStyle, canvasObjectStyle, canvasRootStyle, canvasStyle } from './canvas.css';

interface CanvasComponentProps {
  space: SpaceStore;
}

export function CanvasComponent({ space }: CanvasComponentProps) {
  const canvas = useRef<HTMLDivElement>(null);
  const canvasRoot = useRef<HTMLDivElement>(null);

  const { position, components } = useStore(space);
  const { resetPosition } = useStore(position);
  const { setActive } = useStore(store.activeSpace!.activeComponent!);

  useLayoutEffect(() => {
    const gesture = new TinyGesture(canvas.current, {
      mouseSupport: false,
    });

    function setCanvasStylePosition(x: string, y: string) {
      canvas.current!.style.backgroundPosition = `${x} ${y}`;
      canvasRoot.current!.style.transform = `translateX(${position.x}px) translateY(${position.y}px)`;
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
  }, []);

  const positionCss = `${position.x}px ${position.y}px`;

  return (
    <div
      ref={canvas}
      className={canvasStyle}
      style={{
        backgroundPosition: positionCss,
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
        className={canvasRootStyle}
        style={{
          transform: `translateX(${position.x}px) translateY(${position.y}px)`,
        }}
      >
        <div className={canvasContainerStyle}>
          {components.map((component) => (
            <div
              key={`canvas-${component.id}`}
              className={canvasObjectStyle}
              style={{
                transform: 'translate3d(-100px, -50px, 0)',
              }}
            >
              <ComponentComponent
                component={component}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
