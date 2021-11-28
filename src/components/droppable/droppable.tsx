import { useDrop } from 'react-dnd';

import { ComponentStore } from '../../store/component.store';
import { ElementStore } from '../../store/element.store';
import { cc } from '../../utils/class-names';
import { ItemTypes } from '../draggable-preview/draggable-preview';

import style from './droppable.module.scss';

export interface DroppableResult {
  container: ElementStore | ComponentStore;
}

interface DroppableProps extends React.PropsWithChildren<unknown> {
  className?: string;
}

export function Droppable({ className, container, children }: DroppableProps & DroppableResult) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [
      ItemTypes.PREVIEW,
    ],

    collect(monitor) {
      return {
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      };
    },

    drop: () => ({ container }),
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
