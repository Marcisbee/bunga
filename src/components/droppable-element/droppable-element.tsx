import { useRef } from 'react';
import { useDrop } from 'react-dnd';

import { ItemTypes } from '../../constants/draggable-item-types';
import { DropPositionTypes } from '../../constants/drop-position-types';
import { ElementTextStore } from '../../store/element-text.store';
import { ElementStore } from '../../store/element.store';
import { cc } from '../../utils/class-names';

import style from './droppable-element.module.scss';

export interface DroppableElementResult {
  parent: ElementStore;
  container: ElementStore | ElementTextStore;
  position: keyof typeof DropPositionTypes;
}

interface DroppableElementProps extends React.PropsWithChildren<unknown> {
  className?: string;
  parent: DroppableElementResult['parent'];
  container: DroppableElementResult['container'];
}

export function DroppableElement({
  className,
  parent,
  container,
  children,
}: DroppableElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver, canDrop, handlerId }, drop] = useDrop(() => ({
    accept: [
      ItemTypes.ELEMENT,
    ],

    collect(monitor) {
      return {
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
        handlerId: monitor.getHandlerId(),
      };
    },

    drop: (item, monitor) => {
      if (!ref.current) {
        return;
      }

      const dropTarget = ref.current.getBoundingClientRect();
      const offset = monitor.getClientOffset();

      if (!offset) {
        return;
      }

      const h = ((offset.y - dropTarget.top) * 100) / dropTarget.height;

      console.log(h);

      // @TODO: Create dropping elements for top, bottom, left, right, inside.
      const position = h >= 80
        ? DropPositionTypes.BOTTOM
        : h <= 20
          ? DropPositionTypes.TOP
          : DropPositionTypes.INSIDE;

      return {
        parent,
        container,
        position,
      };
    },
  }));

  drop(ref);

  return (
    <>
      <style>
        {`
          #${handlerId?.toString()} {
            display: inline-block;
            position: relative;
          }
          #${handlerId?.toString()}.canDrop.isOver {
            outline: 2px solid #0074d9;
          }
          #${handlerId?.toString()}.canDrop.isOver::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            background-color: rgba(0, 153, 255, 0.15);
          }
        `}
      </style>
      <div
        ref={ref}
        id={handlerId?.toString()}
        className={cc([
          className,
          canDrop && 'canDrop',
          isOver && 'isOver',
        ])}
      >
        {children}
      </div>
    </>
  );
}
