import { useStore } from 'exome/react';

import { ComponentStore } from '../../store/component.store';
import { store } from '../../store/store';
import { cc } from '../../utils/class-names';
import { ElementChildrenComponent } from '../element/element.component';
import { ShadowView } from '../shadow/shadow.component';

import style from './component.module.scss';

interface ComponentComponentProps {
  component: ComponentStore;
}

export function ComponentRenderComponent({ component }: ComponentComponentProps) {
  const { name, elements } = useStore(component);

  return (
    <>
      <span className={style.name}>
        {name}
      </span>

      <div className={style.container}>
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
        style.object,
        isActive && style.active,
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
      tabIndex={0}
      onKeyDown={(e) => {
        const modifier = e.shiftKey ? 30 : 10;

        if (!e.key.startsWith('Arrow')) {
          return;
        }

        if (e.key === 'ArrowUp') {
          moveTo(x, y - modifier);
        }

        if (e.key === 'ArrowDown') {
          moveTo(x, y + modifier);
        }

        if (e.key === 'ArrowLeft') {
          moveTo(x - modifier, y);
        }

        if (e.key === 'ArrowRight') {
          moveTo(x + modifier, y);
        }

        e.preventDefault();
        e.stopPropagation();
        store.activeSpace!.boundary.updateBoundary();
      }}
    >
      <ComponentRenderComponent component={component} />
    </div>
  );
}
