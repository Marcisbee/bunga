import { getExomeId } from 'exome';
import { useStore } from 'exome/react';

import { ComponentStore } from '../../../store/component.store';
import { ElementTextStore } from '../../../store/element-text.store';
import { ElementStore } from '../../../store/element.store';
import { store } from '../../../store/store';

function ElementAddLayersComponent({ active }: { active: ComponentStore }) {
  const { name, customBlockElements } = useStore(store.activeProject!);

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();

        const typeInput = ((e.target as HTMLFormElement)[0] as HTMLInputElement);
        const typeValue = typeInput.value;

        typeInput.value = '';

        if (typeValue == null || typeValue === '' || !customBlockElements[Number(typeValue)]) {
          return;
        }

        active.addElement(new ElementStore(customBlockElements[Number(typeValue)], undefined, [
          new ElementTextStore('another'),
        ]));
      }}
    >
      <select name="type" defaultValue="">
        <option value="" disabled>Choose tag</option>
        {/* <option value="div">div</option>
        <option value="input">input</option>
        <option value="textarea">textarea</option>
        <option value="button">button</option>
        <option value="p">p</option>
        <option value="h1">h1</option> */}
        {customBlockElements.map((element, i) => (
          <option
            key={`layer-custom-element-${getExomeId(element)}`}
            value={i}
          >
            [
            {name}
            ]
            {' '}
            {element.input.name}
          </option>
        ))}
      </select>
      <button type="submit">add</button>
    </form>
  );
}

function ElementLayersComponent({ element }: { element: ElementStore | ElementTextStore }) {
  const el = useStore(element);

  if (!(el instanceof ElementStore)) {
    const { text } = el as ElementTextStore;

    if (typeof text === 'string') {
      return (
        <li>
          <i>{text}</i>
        </li>
      );
    }

    return (
      <li>
        <i>{getExomeId(text)}</i>
      </li>
    );
  }

  return (
    <li>
      <i>{(!el.type || typeof el.type === 'string') ? el.type : el.type.title}</i>
      {el.children && (
        <ElementsLayersComponent elements={el.children} />
      )}
    </li>
  );
}

function ElementsLayersComponent({ elements }: { elements: (ElementStore | ElementTextStore)[] }) {
  return (
    <ul>
      {elements.map((element) => (
        <ElementLayersComponent
          key={`layer-element-${getExomeId(element)}`}
          element={element}
        />
      ))}
    </ul>
  );
}

function ActiveLayersComponent({ active }: { active: ComponentStore }) {
  const { elements } = useStore(active);

  return (
    <div>
      <ElementsLayersComponent elements={elements} />

      {/* <hr />

      <ElementAddLayersComponent active={active} /> */}
    </div>
  );
}

export function LayersComponent() {
  const {
    spaces,
    activeSpace,
    addSpace,
    setActiveSpace,
    removeSpace,
  } = useStore(store.activeProject!);
  const { components, addComponent, move } = useStore(activeSpace);
  const { selectedComponents, selectComponent } = useStore(move);

  return (
    <div style={{ userSelect: 'none' }}>
      <div>
        <strong>Spaces</strong>
        <button
          type="button"
          onClick={() => addSpace()}
          style={{ float: 'right' }}
        >
          +
        </button>
        <div style={{ minHeight: 200, position: 'relative' }}>
          {spaces.map((space) => (
            <div
              key={`layer-space-${getExomeId(space)}`}
              role="button"
              onClick={() => setActiveSpace(space)}
            >
              {activeSpace === space && '!'}
              {' '}
              {space.name}

              {spaces.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeSpace(space);
                  }}
                  style={{ right: 0, position: 'absolute' }}
                >
                  x
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <hr />
        <strong>Components</strong>
        <button
          type="button"
          onClick={addComponent}
          style={{ float: 'right' }}
        >
          +
        </button>
        <div style={{ minHeight: 200 }}>
          {components.map((component) => (
            <div key={`layer-component-${getExomeId(component)}`}>
              <div
                role="button"
                onClick={(e) => selectComponent(component, e.shiftKey)}
              >
                {selectedComponents.indexOf(component) > -1 && '!'}
                {' '}
                {component.name}
              </div>
              <hr />
              <ActiveLayersComponent active={component} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
