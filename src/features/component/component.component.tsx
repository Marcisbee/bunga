import { onAction } from 'exome';
import { useStore } from 'exome/react';
import {
  useLayoutEffect,
  useRef,
  MouseEventHandler,
  useMemo,
} from 'react';

import { DroppableComponent } from '../../components/droppable-component/droppable-component';
import { ShadowView } from '../../components/shadow/shadow.component';
import { ComponentPositionSilentStore, ComponentStore } from '../../store/component.store';
import { store } from '../../store/store';
import { cc } from '../../utils/class-names';
import { ElementChildrenComponent } from '../element/element.component';

import style from './component.module.scss';

interface ComponentComponentProps {
  component: ComponentStore;
}

function onMouseMoveDiff(
  moving: (diffX: number, diffY: number) => void,
): MouseEventHandler<HTMLElement> {
  return (mouseDownEvent) => {
    mouseDownEvent.stopPropagation();
    mouseDownEvent.preventDefault();

    let x = mouseDownEvent.pageX;
    let y = mouseDownEvent.pageY;

    const handlerMove = (e: MouseEvent) => {
      e.stopPropagation();

      if (e.pageX === x && e.pageY === y) {
        return;
      }

      const diffX = e.pageX - x;
      const diffY = e.pageY - y;

      x = e.pageX;
      y = e.pageY;

      moving(diffX, diffY);
    };

    window.addEventListener('mousemove', handlerMove, { passive: true });

    const handlerEnd = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      window.removeEventListener('mousemove', handlerMove);

      window.removeEventListener('mouseup', handlerEnd);
      window.removeEventListener('mouseleave', handlerEnd);
    };

    window.addEventListener('mouseup', handlerEnd);
    window.addEventListener('mouseleave', handlerEnd);
  };
}

export function ComponentRenderComponent({ component }: ComponentComponentProps) {
  const { name, elements, position } = useStore(component);

  const onMouseDownTopLeft = useMemo(() => (
    onMouseMoveDiff((diffX, diffY) => {
      position.silent.moveTo(position.x + diffX, position.y + diffY);
      position.resize(position.width - diffX, position.height - diffY);
    })
  ), [position]);

  const onMouseDownTopRight = useMemo(() => (
    onMouseMoveDiff((diffX, diffY) => {
      position.silent.moveTo(position.x, position.y + diffY);
      position.resize(position.width + diffX, position.height - diffY);
    })
  ), [position]);

  const onMouseDownBottomLeft = useMemo(() => (
    onMouseMoveDiff((diffX, diffY) => {
      position.silent.moveTo(position.x + diffX, position.y);
      position.resize(position.width - diffX, position.height + diffY);
    })
  ), [position]);

  const onMouseDownBottomRight = useMemo(() => (
    onMouseMoveDiff((diffX, diffY) => {
      position.resize(position.width + diffX, position.height + diffY);
    })
  ), [position]);

  return (
    <>
      <span className={style.name}>
        {name}
      </span>

      <DroppableComponent
        container={component}
        className={style.container}
      >
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <i
          className={style.resize}
          onMouseDown={onMouseDownTopLeft}
          style={{
            top: -4,
            left: -4,
            cursor: 'nwse-resize',
          }}
        />
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <i
          className={style.resize}
          onMouseDown={onMouseDownTopRight}
          style={{
            top: -4,
            right: -4,
            cursor: 'nesw-resize',
          }}
        />
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <i
          className={style.resize}
          style={{
            bottom: -4,
            left: -4,
            cursor: 'nesw-resize',
          }}
          onMouseDown={onMouseDownBottomLeft}
        />
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <i
          className={style.resize}
          style={{
            bottom: -4,
            right: -4,
            cursor: 'nwse-resize',
          }}
          onMouseDown={onMouseDownBottomRight}
        />

        <ShadowView>
          {/* @TODO: Add root node that will handle adding/removing children. */}
          <ElementChildrenComponent
            elements={elements}
            // parent={????}
          />
        </ShadowView>
      </DroppableComponent>
    </>
  );
}

export function ComponentComponent({ component }: ComponentComponentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const {
    x,
    y,
    width,
    height,
  } = useStore(component.position);
  const { move } = store.activeProject!.activeSpace;
  const {
    selectedAll,
    selectedComponents,
    selectComponent,
    startMouseMove,
  } = useStore(move);

  const isActive = selectedComponents.indexOf(component) > -1;

  useLayoutEffect(() => {
    const unsubscribe = onAction(ComponentPositionSilentStore, 'moveTo', (instance) => {
      if (instance !== component.position.silent) {
        return;
      }

      ref.current!.style.transform = `translate(${instance.x}px, ${instance.y}px)`;
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div
      ref={ref}
      role="button"
      className={cc([
        style.object,
        isActive && style.active,
      ])}
      onDoubleClick={(e) => {
        // Stop bubbling to top canvas.
        e.stopPropagation();

        if (e.button > 0) {
          return;
        }

        selectComponent(component, e.shiftKey);
      }}
      onMouseDown={(e) => {
        // Stop bubbling to top canvas.
        e.stopPropagation();

        if (e.button > 0) {
          return;
        }

        if (e.shiftKey) {
          return;
        }

        if (!isActive) {
          return;
        }

        // if (selectedAll.length <= 1) {
        //   selectComponent(component, e.shiftKey);
        // }

        startMouseMove(e.pageX, e.pageY);
      }}
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
        width,
        height,
      }}
      tabIndex={0}
    >
      <ComponentRenderComponent component={component} />
      {isActive && (
        <div className={style.dimensions}>
          {width}
          {' × '}
          {height}
        </div>
      )}
    </div>
  );
}
