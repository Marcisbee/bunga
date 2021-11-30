import React from 'react';
import { useDrag } from 'react-dnd';

import { ItemTypes } from '../../constants/draggable-item-types';
import { DropPositionTypes } from '../../constants/drop-position-types';
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
  const [{ isDragging, handlerId }, drag] = useDrag(() => ({
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

      // @TODO: Fix issues with drop position where it randomly changes position.
      // Maybe allow dragging element outside 1 level (parents siblings)
      // and inside 1 level (siblings & siblings child)?
      console.log(dropResult.position);

      if (item.element === dropResult.container) {
        // Don't drop self into itself.
        return;
      }

      item.parent.remove(item.element);

      if (dropResult.position === DropPositionTypes.TOP) {
        dropResult.parent.addBefore(item.element, dropResult.container);
        return;
      }

      if (dropResult.position === DropPositionTypes.BOTTOM) {
        dropResult.parent.addAfter(item.element, dropResult.container);
        return;
      }

      if (dropResult.container instanceof ElementStore) {
        dropResult.container.append(item.element);
        return;
      }

      dropResult.parent.append(item.element);
    },
  }));

  return (
    <>
      <style>
        {`
          #${handlerId?.toString()}.isDragging {
            pointer-events: none !important;
            background-color: #f0f0f0 !important;
          }
          #${handlerId?.toString()}.isDragging * {
            pointer-events: none !important;
            opacity: 0;
          }
        `}
      </style>
      <div
        ref={drag}
        role="button"
        id={handlerId?.toString()}
        className={cc([
          style.draggable,
          isDragging && 'isDragging',
        ])}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </>
  );
}
