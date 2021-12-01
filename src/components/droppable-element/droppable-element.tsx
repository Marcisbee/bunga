import { CSSProperties, useRef } from 'react';
import { useDrop } from 'react-dnd';

import { ItemTypes } from '../../constants/draggable-item-types';
import { DropPositionTypes } from '../../constants/drop-position-types';
import { ElementTextStore } from '../../store/element-text.store';
import { ElementStore } from '../../store/element.store';
import { cc } from '../../utils/class-names';

// import styles from './droppable-element.module.scss';

export interface DroppableElementResult {
  parent: ElementStore;
  element: ElementStore | ElementTextStore;
  position: keyof typeof DropPositionTypes;
}

interface DroppableElementProps extends React.PropsWithChildren<unknown> {
  parent: DroppableElementResult['parent'];
  element: DroppableElementResult['element'];
  position: keyof typeof DropPositionTypes;
  className?: string;
  style?: CSSProperties,
}

export function DroppableElement({
  parent,
  element,
  className,
  position,
  style,
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
        didDrop: monitor.didDrop(),
        canDrop: monitor.canDrop(),
        handlerId: monitor.getHandlerId(),
      };
    },

    drop: (e, monitor) => {
      if (monitor.didDrop()) {
        // Check whether some nested target already handled drop.
        return;
      }

      return ({
        parent,
        element,
        position,
      });
    },
  }), [parent, element, position]);

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
            pointer-events: none;
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
        style={style}
      >
        {children}
      </div>
    </>
  );
}
