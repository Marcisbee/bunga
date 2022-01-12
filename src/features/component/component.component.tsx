import { onAction } from 'exome';
import { useStore } from 'exome/react';
import {
  useLayoutEffect,
  useRef,
  useMemo,
} from 'react';

import { DraggableComponent } from '../../components/draggable-component/draggable-component';
import { DroppableComponent } from '../../components/droppable-component/droppable-component';
import { ShadowView } from '../../components/shadow/shadow.component';
import { ComponentPositionSilentStore, ComponentStore } from '../../store/component.store';
import { interactiveModeStore } from '../../store/interactive-mode.store';
import { store } from '../../store/store';
import { cc } from '../../utils/class-names';
import { onMouseMoveDiff } from '../../utils/on-mouse-move-diff';
import { RenderChildrenComponent } from '../element/element.component';

import style from './component.module.scss';

interface ComponentComponentProps {
  component: ComponentStore;
}

export function ComponentRenderComponent({ component }: ComponentComponentProps) {
  const { isInteractive } = useStore(interactiveModeStore);
  const {
    type,
    name,
    root,
    position,
  } = useStore(component);

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
      <span
        className={cc([
          style.name,
          type === 'component' && style.component,
          type === 'shape' && style.shape,
        ])}
      >
        <DraggableComponent component={component}>
          {type === 'component' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fillRule="evenodd" clipRule="evenodd"><path fill="currentColor" d="M12-.001l11 6v12l-11 6-11-6v-12l11-6z" /></svg>
          )}
          {type === 'shape' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fillRule="evenodd" clipRule="evenodd"><path fill="currentColor" d="M12 0l-11 6v12l11 6 11-6v-12l-11-6zm-9 16.813v-9.626l9-4.908 9 4.908v9.626l-9 4.909-9-4.909z" /></svg>
          )}
          {name}
        </DraggableComponent>
      </span>

      <DroppableComponent
        container={component}
        className={cc([
          style.container,
          isInteractive && style.interactive,
        ])}
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
          <style>
            {`
              [draggable="true"]:hover {
                outline: 1px dashed blue;
              }
              [data-can-drop="true"][data-is-over="true"] {
                outline: 1px dashed red;
              }
              [draggable="true"]:active {
                outline: none;
              }
            `}
          </style>
          <RenderChildrenComponent
            elements={root.children}
            parent={root}
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
    selectedComponents,
    selectComponent,
    startMouseMove,
  } = useStore(move);
  const { isInteractive } = useStore(interactiveModeStore);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      role="button"
      className={cc([
        style.object,
        component.type === 'shape' && style.shape,
        isActive && style.active,
      ])}
      onDoubleClick={(e) => {
        // Stop bubbling to top canvas.
        e.stopPropagation();

        if (isInteractive) {
          return;
        }

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
