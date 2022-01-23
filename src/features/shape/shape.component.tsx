import { getExomeId, onAction } from 'exome';
import { useStore } from 'exome/react';
import {
  useLayoutEffect,
  useRef,
  useMemo,
  createElement,
  createContext,
} from 'react';

import { DraggableComponent } from '../../components/draggable-component/draggable-component';
import { DroppableComponent } from '../../components/droppable-component/droppable-component';
import { ShadowView } from '../../components/shadow/shadow.component';
import { ElementTextStore } from '../../store/element-text.store';
import { interactiveModeStore } from '../../store/interactive-mode.store';
import { ShapePositionSilentStore, ShapePositionStore, ShapeStore } from '../../store/shape.store';
import { store } from '../../store/store';
import { cc } from '../../utils/class-names';
import { onMouseMoveDiff } from '../../utils/on-mouse-move-diff';
import { RenderChildrenComponent, RenderCssComponent, RenderShapeComponent } from '../element/element.component';

import style from './shape.module.scss';

interface ShapeComponentProps {
  shape: ShapeStore;
}

export const ElementContext = createContext({
  canEdit: false,
});

export function ShapeRenderComponent({ shape }: ShapeComponentProps) {
  const { isInteractive } = useStore(interactiveModeStore);
  const {
    name,
    root,
    position,
    style: shapeStyle,
  } = useStore(shape);
  const id = getExomeId(shape);

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
          style.shape,
        ])}
      >
        {/* <DraggableComponent component={component}> */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fillRule="evenodd" clipRule="evenodd"><path fill="currentColor" d="M12 0l-11 6v12l11 6 11-6v-12l-11-6zm-9 16.813v-9.626l9-4.908 9 4.908v9.626l-9 4.909-9-4.909z" /></svg>
        {name}
        {/* </DraggableComponent> */}
      </span>

      {/* <DroppableComponent
        container={component}
        className={cc([
          style.container,
          isInteractive && style.interactive,
        ])}
      > */}
      <div
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
              [draggable="true"]:active {
                outline: none;
              }
            `}
          </style>
          <RenderCssComponent id={id} style={shapeStyle} />
          {createElement(
            shapeStyle.type,
            {
              id,
              onDoubleClick: (e: any) => {
                e.preventDefault();
                e.stopPropagation();

                root.append(
                  new ElementTextStore('text'),
                );
              },
            },
            <RenderChildrenComponent
              elements={root.children}
              parent={root}
            />,
          )}
        </ShadowView>
      </div>
      {/* </DroppableComponent> */}
    </>
  );
}

export function ShapeComponent({ shape }: ShapeComponentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const {
    x,
    y,
    width,
    height,
  } = useStore(shape.position);
  const { move } = store.activeProject!.activeSpace;
  const {
    selectedComponents,
    selectComponent,
    startMouseMove,
  } = useStore(move);
  const { isInteractive } = useStore(interactiveModeStore);

  const isActive = selectedComponents.indexOf(shape) > -1;
  const contextValue = useMemo(() => ({
    canEdit: isActive,
  }), [isActive]);

  useLayoutEffect(() => {
    const unsubscribe = onAction(ShapePositionSilentStore, 'moveTo', (instance) => {
      if (instance !== shape.position.silent) {
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
        style.shape,
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

        selectComponent(shape, e.shiftKey);
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
      <ElementContext.Provider
        value={contextValue}
      >
        <ShapeRenderComponent shape={shape} />
      </ElementContext.Provider>
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
