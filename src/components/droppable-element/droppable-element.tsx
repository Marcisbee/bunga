import { useDrop } from 'react-dnd';

import { ItemTypes } from '../../constants/draggable-item-types';
import { ElementStore } from '../../store/element.store';
import { cc } from '../../utils/class-names';

import style from './droppable-element.module.scss';

export interface DroppableElementResult {
  parent: ElementStore;
  container: ElementStore;
}

interface DroppableElementProps extends React.PropsWithChildren<unknown> {
  className?: string;
}

export function DroppableElement({
  className,
  parent,
  container,
  children,
}: DroppableElementProps & DroppableElementResult) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [
      ItemTypes.ELEMENT,
    ],

    collect(monitor) {
      return {
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      };
    },

    drop: () => ({ parent, container }),
  }));

  return (
    <div
      ref={drop}
      className={cc([
        className,
        canDrop && style.canDrop,
        isOver && style.isOver,
      ])}
    >
      {children}
    </div>
  );
}
