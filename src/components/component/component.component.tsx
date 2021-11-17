import { useStore } from 'exome/react';

import { ComponentStore } from '../../store/component.store';
import { store } from '../../store/store';
import { cc } from '../../utils/class-names';
import { ElementChildrenComponent } from '../element/element.component';
import { ShadowView } from '../shadow/shadow.component';

import { activeStyle, containerStyle, nameStyle, objectStyle } from './component.css';

interface ComponentComponentProps {
  component: ComponentStore;
}

export function ComponentRenderComponent({ component }: ComponentComponentProps) {
  const { name, elements } = useStore(component);

  return (
    <>
      <span className={nameStyle}>
        {name}
      </span>

      <div className={containerStyle}>
        <ShadowView>
          <ElementChildrenComponent
            elements={elements}
          />
        </ShadowView>
      </div>
    </>
  );
}

export function ComponentComponent({ component }: ComponentComponentProps) {
  const { x, y, width, height, moveTo } = useStore(component.position);
  const { active, setActive } = useStore(store.activeSpace!.activeComponent!);

  const isActive = active === component;

  return (
    <div
      className={cc([
        objectStyle,
        isActive && activeStyle,
      ])}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setActive(component);
      }}
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
        width,
        height,
      }}
      tabIndex={1}
      onKeyDown={(e) => {
        e.preventDefault();
        e.stopPropagation();

        const modifier = e.shiftKey ? 30 : 10;

        if (e.key === 'ArrowUp') {
          moveTo(x, y - modifier);
          store.activeSpace!.boundary.updateBoundary();
          return;
        }

        if (e.key === 'ArrowDown') {
          moveTo(x, y + modifier);
          store.activeSpace!.boundary.updateBoundary();
          return;
        }

        if (e.key === 'ArrowLeft') {
          moveTo(x - modifier, y);
          store.activeSpace!.boundary.updateBoundary();
          return;
        }

        if (e.key === 'ArrowRight') {
          moveTo(x + modifier, y);
          store.activeSpace!.boundary.updateBoundary();
          return;
        }
      }}
    >
      <ComponentRenderComponent component={component} />
    </div>
  );
}
