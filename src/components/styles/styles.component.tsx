import { useStore } from 'exome/react';

import { ComponentStore } from '../../store/component.store';
import { ElementStore } from '../../store/element.store';
import { store } from '../../store/store';
import { StyleStore } from '../../store/style.store';
import { activeStyle } from '../component/component.css';

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

function ActiveStylesComponent({ active }: { active: StyleStore }) {
  const { name, css, setName, setCss } = useStore(active);

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <textarea
        style={{ width: '100%' }}
        rows={10}
        value={css}
        onChange={(e) => {
          setCss(e.target.value);
        }}
      />
    </div>
  );
}

export function StylesComponent() {
  const { activeStyle, addStyle } = useStore(store.activeSpace!);
  const { active, setActive } = useStore(activeStyle!);

  return (
    <div>
      <div>
        <strong>Styles manager</strong>
        <button
          onClick={addStyle}
          style={{ float: 'right' }}
        >
          +
        </button>
        <div style={{ minHeight: 200 }}>
          {store.activeSpace!.styles.map((style) => (
            <div onClick={() => setActive(style)}>
              {active === style && '!'} {style.name}
            </div>
          ))}
        </div>
      </div>

      <div>
        <hr />
        {!!active && (
          <ActiveStylesComponent active={active} />
        )}
      </div>
    </div>
  );
}
