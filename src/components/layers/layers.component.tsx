import { useStore } from 'exome/react';

import { ComponentStore } from '../../store/component.store';
import { ElementTextStore } from '../../store/element-text.store';
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

        active.addElement(new ElementStore(typeValue, undefined, [
          new ElementTextStore('another'),
        ]));
      }}
    >
      <select name="type" defaultValue="">
        <option value="" disabled>Choose tag</option>
        <option value="div">div</option>
        <option value="input">input</option>
        <option value="textarea">textarea</option>
        <option value="button">button</option>
        <option value="p">p</option>
        <option value="h1">h1</option>
      </select>
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
  const { elements } = useStore(active);

  return (
    <div>
      <ElementsLayersComponent elements={elements} />

      <hr />

      <ElementAddLayersComponent active={active} />
    </div>
  );
}

export function LayersComponent() {
  const { activeComponent, addComponent } = useStore(store.activeSpace!);
  const { active, setActive } = useStore(activeComponent!);

  return (
    <div>
      <div>
        <strong>Components</strong>
        <button
          onClick={addComponent}
          style={{ float: 'right' }}
        >
          +
        </button>
        <div style={{ minHeight: 200 }}>
          {store.activeSpace!.components.map((component) => (
            <div onClick={() => setActive(component)}>
              {active === component && '!'} {component.name}
            </div>
          ))}
        </div>
      </div>

      <div>
        <hr />
        {!!active && (
          <ActiveLayersComponent active={active} />
        )}
      </div>
    </div>
  );
}
