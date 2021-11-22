import { useStore } from 'exome/react';

import { ComponentStore } from '../../store/component.store';
import { moveStore } from '../../store/move.store';
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
  const { x, y, width, height } = useStore(component.position);
  const { selectedAll, selectedComponents, selectComponent, startMouseMove } = useStore(moveStore);

  const isActive = selectedComponents.indexOf(component) > -1;

  return (
    <div
      className={cc([
        style.object,
        isActive && style.active,
      ])}
      onClick={(e) => {
        // Stop bubbling to top canvas.
        e.stopPropagation();

        if (!e.shiftKey) {
          if (!moveStore.didMouseMove) {
            selectComponent(component, e.shiftKey);
          }

          return;
        }

        selectComponent(component, e.shiftKey);
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.shiftKey) {
          return;
        }

        if (selectedAll.length <= 1) {
          selectComponent(component, e.shiftKey);
        }

        startMouseMove(e.pageX, e.pageY);
      }}
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
        width,
        height,
      }}
      tabIndex={0}
    >
      <ComponentRenderComponent component={component} />
    </div>
  );
}
