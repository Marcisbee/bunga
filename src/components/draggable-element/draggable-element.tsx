import { useDrag } from 'react-dnd';

import { ItemTypes } from '../../constants/draggable-item-types';
import { DropPositionTypes } from '../../constants/drop-position-types';
import { ElementTextStore } from '../../store/element-text.store';
import { ElementStore } from '../../store/element.store';
import { DroppableElementResult } from '../droppable-element/droppable-element';

interface UseDraggableElementProps {
  parent: ElementStore;
  element: ElementStore | ElementTextStore;
}

export function useDraggableElement({ parent, element }: UseDraggableElementProps) {
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

      if (item.element === dropResult.element) {
        // Don't drop self into itself.
        return;
      }

      item.parent.remove(item.element);

      if (dropResult.position === DropPositionTypes.TOP) {
        dropResult.parent.addBefore(item.element, dropResult.element);
        return;
      }

      if (dropResult.position === DropPositionTypes.BOTTOM) {
        dropResult.parent.addAfter(item.element, dropResult.element);
        return;
      }

      if (dropResult.element instanceof ElementStore) {
        dropResult.element.append(item.element);
        return;
      }

      dropResult.parent.append(item.element);
    },
  }));

  return {
    drag,
    isDragging,
    handlerId,
  };
}
