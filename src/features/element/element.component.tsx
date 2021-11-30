import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import {
  createElement,
  forwardRef,
  useRef,
} from 'react';

import { DraggableElement } from '../../components/draggable-element/draggable-element';
import { DroppableElement } from '../../components/droppable-element/droppable-element';
import { useObservable } from '../../hooks/use-observable';
import { ElementTextEdge } from '../../store/edges/element-text.edge';
import { RenderElement } from '../../store/edges/element.edge';
import { ElementTextStore } from '../../store/element-text.store';
import { ElementStore } from '../../store/element.store';

interface ElementChildrenComponentProps {
  parent: ElementStore;
  elements: (ElementStore | ElementTextStore)[];
}

export function ElementChildrenComponent({ parent, elements }: ElementChildrenComponentProps) {
  useStore(parent);

  return (
    <>
      {elements.map((element) => {
        // if (element instanceof ElementTextStore) {
        //   return (
        //     <DraggableElement
        //       parent={parent}
        //       element={element}
        //     >
        //       <ElementComponent element={element} />
        //     </DraggableElement>
        //   );
        // }

        return (
          <DraggableElement
            parent={parent}
            element={element}
          >
            <DroppableElement
              key={`element-c-${getExomeId(element)}`}
              parent={parent}
              container={element}
            >
              <ElementComponent element={element} />
            </DroppableElement>
          </DraggableElement>
        );
      })}
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
        children && <ElementChildrenComponent parent={element} elements={children} />,
      );
    }

    return (
      <RenderElement edge={type}>
        {children && <ElementChildrenComponent parent={element} elements={children} />}
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
