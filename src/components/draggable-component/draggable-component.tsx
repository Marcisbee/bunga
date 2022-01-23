import { useStore } from 'exome/react';
import React from 'react';
import { useDrag } from 'react-dnd';

import { ItemTypes } from '../../constants/draggable-item-types';
import { ComponentStore } from '../../store/component.store';
import { ElementStore } from '../../store/element.store';
import { interactiveModeStore } from '../../store/interactive-mode.store';
import { ShapeStore } from '../../store/shape.store';
import { cc } from '../../utils/class-names';
import { DroppableComponentResult } from '../droppable-component/droppable-component';

import style from './draggable-component.module.scss';

interface DraggableComponentProps extends React.PropsWithChildren<unknown> {
  component: ComponentStore | ShapeStore;
}

export function DraggableComponent({ component, children }: DraggableComponentProps) {
  const { isInteractive } = useStore(interactiveModeStore);
  const [{ isDragging, handlerId }, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT,

    item: {
      component,
    },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),

    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DroppableComponentResult>();

      if (!item || !dropResult) {
        return;
      }

      // Don't drop self into self
      if (item.component === dropResult.container) {
        return;
      }

      // Avoid creating infinite loops
      if (item.component instanceof ComponentStore && dropResult.container instanceof ShapeStore) {
        return;
      }

      dropResult.container.root.append(new ElementStore(item.component));
    },
  }));

  return (
    <span
      ref={isInteractive ? undefined : drag}
      role="button"
      id={handlerId?.toString()}
      className={cc([
        style.draggable,
        isDragging && style.isDragging,
      ])}
      onMouseDown={isInteractive
        ? undefined
        : (e) => {
          e.stopPropagation();
        }}
    >
      {children}
    </span>
  );
}
