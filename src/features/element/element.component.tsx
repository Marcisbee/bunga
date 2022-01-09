import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import {
  createElement,
  forwardRef,
  useRef,
} from 'react';

import { DraggableElement } from '../../components/draggable-element/draggable-element';
import { DroppableElement } from '../../components/droppable-element/droppable-element';
import { DropPositionTypes } from '../../constants/drop-position-types';
import { ComponentStore } from '../../store/component.store';
import { StringEdge } from '../../store/edges/data/data.string.edge';
import { ElementTextStore } from '../../store/element-text.store';
import { ElementStore } from '../../store/element.store';
import { interactiveModeStore, useInteractiveEvents } from '../../store/interactive-mode.store';
import { ShapeStore } from '../../store/shape.edge';
import { store } from '../../store/store';
import { StyleStore } from '../../store/style.store';

interface ElementChildrenComponentProps {
  parent: ElementStore;
  elements: (ElementStore | ElementTextStore)[];
}

export function ElementChildrenComponent({ parent, elements }: ElementChildrenComponentProps) {
  const { isInteractive } = useStore(interactiveModeStore);
  useStore(parent);

  if (isInteractive) {
    return (
      <>
        {elements.map((element) => (
          <div
            key={`element-c-${getExomeId(element)}`}
            style={{ display: 'inline-block' }}
          >
            <ElementComponent
              element={element}
            />
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {elements.map((element) => (
        <DraggableElement
          key={`element-c-${getExomeId(element)}`}
          parent={parent}
          element={element}
        >
          <DroppableElement
            parent={parent}
            element={element}
            position={DropPositionTypes.INSIDE}
          >
            <ElementComponent element={element} />
          </DroppableElement>

          <DroppableElement
            parent={parent}
            element={element}
            position={DropPositionTypes.TOP}
            style={{
              position: 'absolute',
              width: '100%',
              height: '20%',
              maxHeight: 20,
              top: 0,
              left: 0,
              overflow: 'hidden',
            }}
          />
          <DroppableElement
            parent={parent}
            element={element}
            position={DropPositionTypes.BOTTOM}
            style={{
              position: 'absolute',
              width: '100%',
              height: '20%',
              maxHeight: 20,
              bottom: 0,
              left: 0,
              overflow: 'hidden',
            }}
          />
        </DraggableElement>
      ))}
    </>
  );
}

interface ElementComponentProps {
  element: (ElementStore | ElementTextStore);
}

export function ElementComponent({ element }: ElementComponentProps) {
  const ref = useRef<HTMLElement>(null);

  if (element instanceof ElementTextStore) {
    return (
      <ElementTextComponent ref={ref} element={element} />
    );
  }

  return (
    <ElementBlockComponent ref={ref} element={element} />
  );
}

const ElementBlockComponent = forwardRef<HTMLElement, { element: ElementStore }>(
  ({ element }, ref) => {
    const { isInteractive } = useStore(interactiveModeStore);
    const { type, props, children } = useStore(element);
    const events = useInteractiveEvents(element);

    if (!type || typeof type === 'string') {
      return createElement(
        type,
        {
          ...props,
          ...events,
          ref,
        },
        (children && <ElementChildrenComponent parent={element} elements={children} />) || null,
      );
    }

    if (type instanceof ComponentStore) {
      return (
        <ElementBlockComponent element={type.root} />
      );
    }

    return (
      <RenderElement
        edge={type}
        {...events}
      >
        {(children && children.length > 0) ? (
          <ElementChildrenComponent parent={element} elements={children} />
        ) : (
          !isInteractive && (
            <span
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: '&nbsp;&nbsp;&nbsp;',
              }}
              style={{
                cursor: 'text',
              }}
              // onDoubleClick={(e) => {
              //   e.preventDefault();
              //   e.stopPropagation();

              //   const project = store.activeProject!;
              //   const space = project.activeSpace;

              //   const textEdge = space.addEdge(StringEdge);
              //   const textElementEdge = space.addEdge(ElementTextEdge);

              //   // textEdge.setAutofocus();
              //   textEdge.output.default.connect('text', textElementEdge);

              //   element.append(new ElementTextStore(textElementEdge));
              // }}
            />
          )
        )}
      </RenderElement>
    );
  },
);

const ElementTextComponent = forwardRef<HTMLElement, { element: ElementTextStore }>(
  ({ element }, ref) => {
    const { text } = useStore(element);

    if (typeof text === 'string') {
      return createElement('span', { ref }, text);
    }

    return createElement('span', { ref }, JSON.stringify(text));
  },
);

export function RenderCss({ style, id }: { style: StyleStore, id: string }) {
  const { css } = useStore(style);
  const { tokens } = useStore(store.activeProject!.tokens[0]);

  return (
    <style>
      {`:host {${tokens}}`}
      {`#${id} {${css}}`}
    </style>
  );
}

interface RenderElementProps extends React.HTMLAttributes<HTMLDivElement> {
  edge: ShapeStore,
  defaultCss?: string,
  children?: React.ReactNode,
}

export function RenderElement({
  edge,
  children,
  defaultCss,
  ...props
}: RenderElementProps) {
  const { style } = useStore(edge);

  const id = getExomeId(edge);

  return (
    <>
      <RenderCss id={id} style={style} />
      {createElement(style.type, { ...props, id }, children)}
    </>
  );
}
