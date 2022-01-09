import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import { useState } from 'react';

import { ComponentStore } from '../../store/component.store';
import { ElementTextStore } from '../../store/element-text.store';
import { ElementStore } from '../../store/element.store';
import { ShapeStore } from '../../store/shape.edge';
import { store } from '../../store/store';
import paneStyle from '../../styles/pane.module.scss';
import { cc } from '../../utils/class-names';

import style from './layers-manager.module.scss';

function ElementLayerComponent({ shape }: { shape: ShapeStore }) {
  const { style: styleStore } = useStore(shape);
  const { name } = useStore(styleStore);

  return (
    <span className={style.itemName}>
      {name}
    </span>
  );
}

function ComponentLayerComponent({ component }: { component: ComponentStore }) {
  const { name } = useStore(component);

  return (
    <span className={style.itemName}>
      {name}
    </span>
  );
}

function ElementLayersComponent({
  element,
  depth,
}: { element: ElementStore | ElementTextStore, depth: number }) {
  const el = useStore(element);

  const depthStyle = {
    paddingLeft: depth * 20,
  };

  if (!(el instanceof ElementStore)) {
    const { text } = el as ElementTextStore;

    if (typeof text === 'string') {
      return (
        <div
          role="button"
          // onClick={(e) => selectComponent(component, e.shiftKey)}
          className={cc([
            style.item,
            style.text,
            // selectedComponents.indexOf(component) > -1 && style.active,
          ])}
          style={depthStyle}
        >
          <span className={style.itemName}>
            {text}
          </span>
        </div>
      );
    }

    return null;
  }

  return (
    <div>
      <div
        role="button"
        // onClick={(e) => selectComponent(component, e.shiftKey)}
        className={cc([
          style.shape,
          style.item,
          // selectedComponents.indexOf(component) > -1 && style.active,
        ])}
        style={depthStyle}
      >
        {(!el.type || typeof el.type === 'string') ? (
          <span className={style.itemName}>
            {el.type}
          </span>
        ) : (
          el.type instanceof ShapeStore ? (
            <ElementLayerComponent shape={el.type} />
          ) : (
            <ComponentLayerComponent component={el.type} />
          )
        )}
      </div>

      {el.children && (
        <ElementsLayersComponent
          elements={el.children}
          depth={depth + 1}
        />
      )}
    </div>
  );
}

function ElementsLayersComponent({
  elements,
  depth = 2,
}: { elements: (ElementStore | ElementTextStore)[], depth?: number }) {
  return (
    <div>
      {elements.map((element) => (
        <ElementLayersComponent
          key={`layer-element-${getExomeId(element)}`}
          element={element}
          depth={depth}
        />
      ))}
    </div>
  );
}

function ChildLayersComponent({ component }: { component: ComponentStore }) {
  const { root } = useStore(component);

  return (
    <ElementsLayersComponent
      elements={root.children}
    />
  );
}

function LayersManagerComponentComponent({ component }: { component: ComponentStore }) {
  const { activeSpace } = useStore(store.activeProject!);
  const { move, removeComponent, boundary } = useStore(activeSpace);
  const { selectedComponents, selectComponent } = useStore(move);
  const { name, type, rename } = useStore(component);

  const [isRenameMode, setIsRenameMode] = useState(false);

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        className={cc([
          style.item,
          type === 'component' && style.component,
          type === 'shape' && style.shape,
          selectedComponents.indexOf(component) > -1 && style.active,
        ])}
        onClick={(e) => {
          if (e.shiftKey) {
            selectComponent(component, e.shiftKey);
            return;
          }

          if (selectedComponents.indexOf(component) > -1) {
            return;
          }

          selectComponent(component);
        }}
        onDoubleClick={() => setIsRenameMode(true)}
        onKeyDown={(e) => {
          if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            e.stopPropagation();

            move.selectedComponents.forEach((comp) => {
              removeComponent(comp);
            });

            move.reset();

            boundary.updateBoundary();
            return false;
          }
        }}
      >
        <span className={style.itemName}>
          {isRenameMode ? (
            <input
              type="text"
              value={name}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              onChange={(e) => {
                rename(e.target.value);
              }}
              onBlur={() => {
                setIsRenameMode(false);
              }}
              onKeyDown={(e) => {
                e.stopPropagation();

                if (e.key === 'Enter') {
                  setIsRenameMode(false);
                  return;
                }

                if (e.key === 'Escape') {
                  setIsRenameMode(false);
                }
              }}
            />
          ) : (
            name
          )}
        </span>
      </div>

      <ChildLayersComponent component={component} />
    </div>
  );
}

export function LayersManagerComponent() {
  const { activeSpace } = useStore(store.activeProject!);
  const { components, addComponent } = useStore(activeSpace);

  return (
    <div className={paneStyle.pane}>
      <div className={paneStyle.header}>
        <strong>Components</strong>
        <button
          type="button"
          onClick={() => addComponent()}
        >
          +
        </button>
      </div>

      <div className={style.list} style={{ maxHeight: 'none' }}>
        {components.map((component) => (
          <LayersManagerComponentComponent
            key={`layer-component-${getExomeId(component)}`}
            component={component}
          />
        ))}
      </div>
    </div>
  );
}
