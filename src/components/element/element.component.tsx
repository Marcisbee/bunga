import { useStore } from 'exome/react';
import { createElement, useLayoutEffect, useRef } from 'react';

import { activeActionConnection } from '../../store/action.store';
import { ElementStore } from '../../store/element.store';

interface ElementChildrenComponentProps {
  elements: ElementStore[];
}

export function ElementChildrenComponent({ elements }: ElementChildrenComponentProps) {
  return (
    <>
      {elements.map((element) => (
        <ElementComponent
          element={element}
        />
      ))}
    </>
  );
}

interface ElementComponentProps {
  element: ElementStore;
}

export function ElementComponent({ element }: ElementComponentProps) {
  const canvasRoot = useRef(document.getElementById('canvasRoot')!);
  const ref = useRef<HTMLElement>(null);

  const { type, props, children } = useStore(element);
  const { from } = useStore(activeActionConnection);

  useLayoutEffect(() => {
    element.getDomOffset = () => {
      if (!ref.current) {
        return {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        };
      }

      const rootRect = canvasRoot.current.getBoundingClientRect();
      const rect = ref.current.getBoundingClientRect();

      console.log('get rect', rootRect.x, rect.y);

      return {
        x: rect.x - rootRect.x,
        y: rect.y - rootRect.y,
        width: rect.width,
        height: rect.height,
      };
    };
  }, []);

  useLayoutEffect(() => {
    if (!from) {
      return;
    }

    function handler(e: MouseEvent) {
      e.stopPropagation();
      e.preventDefault();

      ref.current!.removeEventListener('click', handler);

      from!.addTo(element);

      console.log('Added', from, element);
    }

    ref.current!.addEventListener('click', handler);

    return () => {
      ref.current!.removeEventListener('click', handler);
    };
  }, [from]);

  return createElement(type, { ...props, ref }, children && <ElementChildrenComponent elements={children} />);
}
