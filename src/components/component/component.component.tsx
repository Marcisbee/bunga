import { onAction } from 'exome';
import { useStore } from 'exome/react';
import { useLayoutEffect, useRef } from 'react';

import { ComponentPositionSilentStore, ComponentStore } from '../../store/component.store';
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
  const ref = useRef<HTMLDivElement>(null);
  const { x, y, width, height } = useStore(component.position);
  const move = store.activeProject!.activeSpace.move;
  const { selectedAll, selectedComponents, selectComponent, startMouseMove } = useStore(move);

  const isActive = selectedComponents.indexOf(component) > -1;

  useLayoutEffect(() => {
    const unsubscribe = onAction(ComponentPositionSilentStore, 'moveTo', (instance) => {
      if (instance !== component.position.silent) {
        return;
      }

      ref.current!.style.transform = `translate(${instance.x}px, ${instance.y}px)`;
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cc([
        style.object,
        isActive && style.active,
      ])}
      onClick={(e) => {
        // Stop bubbling to top canvas.
        e.stopPropagation();

        if (e.button > 0) {
          return;
        }

        if (!e.shiftKey) {
          if (!move.didMouseMove) {
            selectComponent(component, e.shiftKey);
          }

          return;
        }

        selectComponent(component, e.shiftKey);
      }}
      onMouseDown={(e) => {
        // Stop bubbling to top canvas.
        e.stopPropagation();

        if (e.button > 0) {
          return;
        }

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
