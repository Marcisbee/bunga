import { useStore } from 'exome/react';

import { ComponentStore } from '../../store/component.store';
import { store } from '../../store/store';
import { cc } from '../../utils/class-names';
import { ElementChildrenComponent } from '../element/element.component';
import { ShadowView } from '../shadow/shadow.component';

import { activeStyle, containerStyle, nameStyle } from './component.css';

interface ComponentComponentProps {
  component: ComponentStore;
}

export function ComponentComponent({ component }: ComponentComponentProps) {
  const { name, elements } = useStore(component);
  const { active, setActive } = useStore(store.activeSpace!.activeComponent!);

  const isActive = active === component;

  return (
    <div
      className={cc([
        isActive && activeStyle,
      ])}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setActive(component);
      }}
    >
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
    </div>
  );
}
