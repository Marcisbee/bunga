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
import { useObservable } from '../../hooks/use-observable';
import { StringEdge } from '../../store/edges/data/data.string.edge';
import { ElementTextEdge } from '../../store/edges/element-text.edge';
import { RenderElement } from '../../store/edges/element.edge';
import { ElementTextStore } from '../../store/element-text.store';
import { ElementStore } from '../../store/element.store';
import { store } from '../../store/store';

interface ElementChildrenComponentProps {
  parent: ElementStore;
  elements: (ElementStore | ElementTextStore)[];
}

export function ElementChildrenComponent({ parent, elements }: ElementChildrenComponentProps) {
  useStore(parent);

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
    const { type, props, children } = useStore(element);

    if (!type || typeof type === 'string') {
      return createElement(
        type,
        { ...props, ref },
        (children && <ElementChildrenComponent parent={element} elements={children} />) || null,
      );
    }

    return (
      <RenderElement edge={type}>
        {(children && children.length > 0) ? (
          <ElementChildrenComponent parent={element} elements={children} />
        ) : (
          <span
            dangerouslySetInnerHTML={{
              __html: '&nbsp;&nbsp;&nbsp;',
            }}
            style={{
              cursor: 'text',
            }}
            onDoubleClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              const project = store.activeProject!;
              const space = project.activeSpace;

              const textEdge = space.addEdge(StringEdge);
              const textElementEdge = space.addEdge(ElementTextEdge);

              // textEdge.setAutofocus();
              textEdge.output.default.connect('text', textElementEdge);

              element.append(new ElementTextStore(textElementEdge));
            }}
          />
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

    return (
      <ElementDynamicTextComponent
        ref={ref}
        edge={text}
      />
    );
  },
);

const ElementDynamicTextComponent = forwardRef<HTMLElement, { edge: ElementTextEdge }>(
  ({ edge }, ref) => {
    const { selectInput } = useStore(edge);

    const value = useObservable<string>(selectInput('text')!);

    return createElement('span', { ref }, value);
  },
);
