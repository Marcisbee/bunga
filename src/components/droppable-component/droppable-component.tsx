import { useDrop } from 'react-dnd';

import { ItemTypes } from '../../constants/draggable-item-types';
import { ComponentStore } from '../../store/component.store';
import { ElementStore } from '../../store/element.store';
import { cc } from '../../utils/class-names';

import style from './droppable-component.module.scss';

export interface DroppableComponentResult {
  container: ElementStore | ComponentStore;
}

interface DroppableComponentProps extends React.PropsWithChildren<unknown> {
  className?: string;
}

export function DroppableComponent({
  className,
  container,
  children,
}: DroppableComponentProps & DroppableComponentResult) {
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
