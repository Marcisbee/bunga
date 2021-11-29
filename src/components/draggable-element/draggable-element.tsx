import React from 'react';
import { useDrag } from 'react-dnd';

import { ItemTypes } from '../../constants/draggable-item-types';
import { ElementTextStore } from '../../store/element-text.store';
import { ElementStore } from '../../store/element.store';
import { cc } from '../../utils/class-names';
import { DroppableElementResult } from '../droppable-element/droppable-element';

import style from './draggable-element.module.scss';

interface DraggableElementProps extends React.PropsWithChildren<unknown> {
  parent: ElementStore;
  element: ElementStore | ElementTextStore;
}

export function DraggableElement({ parent, element, children }: DraggableElementProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ELEMENT,

    item: {
      parent,
      element,
    },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),

    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DroppableElementResult>();

      if (!item || !dropResult) {
        return;
      }

      console.log('Add', item.element, 'to', dropResult.parent, 'before', dropResult.container);

      return;
      item.parent.remove(item.element);
      dropResult.parent.addBefore(item.element, dropResult.container);
      // @TODO: remove

      // if (container instanceof ComponentStore) {
      //   const itemElement = item.element;

      //   if (itemElement instanceof ElementEdge) {
      //     const el = new ElementStore(itemElement, undefined, [
      //       new ElementTextStore('another'),
      //     ]);

      //     container.addElement(el);
      //     return;
      //   }

      //   if (itemElement instanceof ElementTextEdge) {
      //     const el = new ElementTextStore(itemElement);

      //     container.addElement(el);
      //   }
      // }
    },
  }));

  return (
    <div
      ref={drag}
      role="button"
      className={cc([
        style.draggable,
        isDragging && style.isDragging,
      ])}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      {children}
    </div>
  );
}
