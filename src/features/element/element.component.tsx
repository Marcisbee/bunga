import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import {
  createElement,
  forwardRef,
  useRef,
} from 'react';

import { useObservable } from '../../hooks/use-observable';
import { ElementTextEdge } from '../../store/edges/element-text.edge';
import { RenderElement } from '../../store/edges/element.edge';
import { ElementTextStore } from '../../store/element-text.store';
import { ElementStore } from '../../store/element.store';

interface ElementChildrenComponentProps {
  elements: (ElementStore | ElementTextStore)[];
}

export function ElementChildrenComponent({ elements }: ElementChildrenComponentProps) {
  return (
    <>
      {elements.map((element) => (
        <ElementComponent
          key={`element-c-${getExomeId(element)}`}
          element={element}
        />
      ))}
    </>
  );
}

interface ElementComponentProps {
  element: (ElementStore | ElementTextStore);
}

export function ElementComponent({ element }: ElementComponentProps) {
  // const canvasRoot = useRef(document.getElementById('canvasRoot')!);
  const ref = useRef<HTMLElement>(null);

  // const { from, connectTo } = useStore(pendingEdge);

  // useLayoutEffect(() => {
  //   element.getPosition = () => {
  //     if (!ref.current) {
  //       return {
  //         x: 0,
  //         y: 0,
  //         width: 0,
  //         height: 0,
  //       };
  //     }

  //     const rootRect = canvasRoot.current.getBoundingClientRect();
  //     const rect = ref.current.getBoundingClientRect();

  //     console.log('get rect', rootRect.x, rect.y);

  //     return {
  //       x: rect.x - rootRect.x,
  //       y: rect.y - rootRect.y,
  //       width: rect.width,
  //       height: rect.height,
  //     };
  //   };
  // }, []);

  // useLayoutEffect(() => {
  //   if (!from) {
  //     return;
  //   }

  //   function handler(e: MouseEvent) {
  //     e.stopPropagation();
  //     e.preventDefault();

  //     ref.current!.removeEventListener('click', handler);

  //     connectTo('text', (element as ElementTextStore).edge);

  //     console.log('Added', from, element);
  //   }

  //   ref.current!.addEventListener('click', handler);

  //   return () => {
  //     ref.current!.removeEventListener('click', handler);
  //   };
  // }, [from]);

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
        children && <ElementChildrenComponent elements={children} />,
      );
    }

    return (
      <RenderElement edge={type}>
        {children && <ElementChildrenComponent elements={children} />}
      </RenderElement>
    );
    // return <RenderElement ref={ref} edge={type} />;
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
