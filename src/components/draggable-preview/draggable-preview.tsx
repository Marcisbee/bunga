import React from 'react';
import { useDrag } from 'react-dnd';

import { ComponentStore } from '../../store/component.store';
import { ElementTextEdge } from '../../store/edges/element-text.edge';
import { ElementEdge } from '../../store/edges/element.edge';
import { ElementTextStore } from '../../store/element-text.store';
import { ElementStore } from '../../store/element.store';
import { cc } from '../../utils/class-names';
import { DroppableResult } from '../droppable/droppable';

import style from './draggable-preview.module.scss';

export const ItemTypes = {
  PREVIEW: 'PREVIEW',
  ELEMENT: 'ELEMENT',
  COMPONENT: 'COMPONENT',
} as const;

interface DraggablePreviewProps extends React.PropsWithChildren<unknown> {
  preview: ElementEdge | ElementTextEdge;
}

export function DraggablePreview({ preview, children }: DraggablePreviewProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PREVIEW,

    item: {
      preview,
    },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),

    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DroppableResult>();

      if (item && dropResult) {
        const { container } = dropResult;

        if (container instanceof ComponentStore) {
          const itemPreview = item.preview;

          if (itemPreview instanceof ElementEdge) {
            const element = new ElementStore(itemPreview, undefined, [
              new ElementTextStore('another'),
            ]);

            container.addElement(element);
            return;
          }

          if (itemPreview instanceof ElementTextEdge) {
            const element = new ElementTextStore(itemPreview);

            container.addElement(element);
          }
        }
      }
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
