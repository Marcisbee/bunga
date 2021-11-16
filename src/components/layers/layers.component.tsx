import { useStore } from 'exome/react';

import { ComponentStore } from '../../store/component.store';
import { ElementStore } from '../../store/element.store';
import { store } from '../../store/store';

function ElementAddLayersComponent({ active }: { active: ComponentStore }) {
  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();

        const typeInput = ((e.target as HTMLFormElement)[0] as HTMLInputElement)
        const typeValue = typeInput.value;

        typeInput.value = '';

        if (!typeValue) {
          return;
        }

        active.addElement(new ElementStore(typeValue, {
          dangerouslySetInnerHTML: {
            __html: 'another',
          },
        }));
      }}
    >
      <input type="text" name="type" />
      <button type="submit">add</button>
    </form>
  );
}

function ElementLayersComponent({ element }: { element: ElementStore }) {
  const { type, children } = useStore(element);

  return (
    <li>
      <i>{type}</i>
      {children && (
        <ElementsLayersComponent elements={children} />
      )}
    </li>
  );
}

function ElementsLayersComponent({ elements }: { elements: ElementStore[] }) {
  return (
    <ul>
      {elements.map((element) => (
        <ElementLayersComponent element={element} />
      ))}
    </ul>
  );
}

function ActiveLayersComponent({ active }: { active: ComponentStore }) {
  const { name, elements } = useStore(active);

  return (
    <div>
      <strong>{name}</strong>

      <ElementsLayersComponent elements={elements} />

      <hr />

      <ElementAddLayersComponent active={active} />
    </div>
  );
}

export function LayersComponent() {
  const { active } = useStore(store.activeSpace!.activeComponent!);

  if (!active) {
    return null;
  }

  return (
    <ActiveLayersComponent active={active} />
  );
}
