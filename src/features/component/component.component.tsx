import { getExomeId, onAction } from 'exome';
import { useStore } from 'exome/react';
import {
  useLayoutEffect,
  useRef,
  useMemo,
  useContext,
} from 'react';

import { DraggableComponent } from '../../components/draggable-component/draggable-component';
import { DroppableComponent } from '../../components/droppable-component/droppable-component';
import { ShadowView } from '../../components/shadow/shadow.component';
import { useObservable } from '../../hooks/use-observable';
import { ComponentPositionSilentStore, ComponentStore } from '../../store/component.store';
import { pendingEdge } from '../../store/edges/pending';
import { VariableEdge } from '../../store/edges/variable';
import { interactiveModeStore } from '../../store/interactive-mode.store';
import { store } from '../../store/store';
import { cc } from '../../utils/class-names';
import { onMouseMoveDiff } from '../../utils/on-mouse-move-diff';
import { RenderChildrenComponent } from '../element/element.component';
import { ElementContext } from '../shape/shape.component';

import style from './component.module.scss';

interface ComponentComponentProps {
  component: ComponentStore;
}

function ComponentVariableComponent({
  component,
  variable,
}: ComponentComponentProps & { variable: VariableEdge }) {
  const { input } = useStore(variable);
  const name = useObservable(input.name)!;

  return (
    <div className={style.variable}>
      <span
        className={style.remove}
        onClick={() => component.removeVariable(variable)}
      >
        ×
      </span>

      <div
        contentEditable
        onBlur={(e) => {
          input.name.next(e.target.textContent || '');
        }}
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onKeyUp={(e) => {
          e.stopPropagation();
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        suppressContentEditableWarning
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: name,
        }}
      />
    </div>
  );
}

export function ComponentRenderComponent({ component }: ComponentComponentProps) {
  const { canEdit } = useContext(ElementContext);
  const { isInteractive } = useStore(interactiveModeStore);
  const {
    name,
    root,
    position,
    variables,
    addVariable,
  } = useStore(component);
  const { from, connectTo } = useStore(pendingEdge);

  const contextValue = useMemo(() => ({
    canEdit,
    variables,
  }), [canEdit, variables]);

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
      <div className={style.variables}>
        {variables.map((variable) => (
          <ComponentVariableComponent
            key={getExomeId(variable)}
            component={component}
            variable={variable}
          />
        ))}
      </div>

      <span
        className={cc([
          style.name,
          style.component,
        ])}
      >
        {/* <DraggableComponent component={component}> */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fillRule="evenodd" clipRule="evenodd"><path fill="currentColor" d="M12-.001l11 6v12l-11 6-11-6v-12l11-6z" /></svg>
        {name}
        {/* </DraggableComponent> */}
      </span>

      <DroppableComponent
        container={component}
        className={cc([
          style.container,
          !!from && style.connectable,
          isInteractive && style.interactive,
        ])}
        onMouseUp={from ? async () => {
          if (from) {
            // @TODO: Maybe use proper edge position type?
            const variableEdge = new VariableEdge(position as never);
            connectTo('value', variableEdge);

            variableEdge.input.name.next(`value${variables.length + 1}`);

            addVariable(variableEdge);
          }
        } : undefined}
      >
        <i
          className={style.resize}
          onMouseDown={onMouseDownTopLeft}
          style={{
            top: -4,
            left: -4,
            cursor: 'nwse-resize',
          }}
        />
        <i
          className={style.resize}
          onMouseDown={onMouseDownTopRight}
          style={{
            top: -4,
            right: -4,
            cursor: 'nesw-resize',
          }}
        />
        <i
          className={style.resize}
          style={{
            bottom: -4,
            left: -4,
            cursor: 'nesw-resize',
          }}
          onMouseDown={onMouseDownBottomLeft}
        />
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
          <ElementContext.Provider
            value={contextValue}
          >
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
            <RenderChildrenComponent
              elements={root.children}
              parent={root}
            />
          </ElementContext.Provider>
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
