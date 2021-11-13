import { useStore } from 'exome/react';
import { createElement } from 'react';

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
  const { type, props, children } = useStore(element);

  return createElement(type, props, children && <ElementChildrenComponent elements={children} />);
}
