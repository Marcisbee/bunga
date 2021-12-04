import { MouseEventHandler } from 'react';

export function onMouseMoveDiff(
  moving: (diffX: number, diffY: number) => void,
  stopped?: () => void,
): MouseEventHandler<HTMLElement> {
  return (mouseDownEvent) => {
    mouseDownEvent.stopPropagation();
    mouseDownEvent.preventDefault();

    let x = mouseDownEvent.pageX;
    let y = mouseDownEvent.pageY;

    const handlerMove = (e: MouseEvent) => {
      e.stopPropagation();

      if (e.pageX === x && e.pageY === y) {
        return;
      }

      const diffX = e.pageX - x;
      const diffY = e.pageY - y;

      x = e.pageX;
      y = e.pageY;

      moving(diffX, diffY);
    };

    window.addEventListener('mousemove', handlerMove, { passive: true });

    const handlerEnd = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (stopped) {
        stopped();
      }

      window.removeEventListener('mousemove', handlerMove);

      window.removeEventListener('mouseup', handlerEnd);
      window.removeEventListener('mouseleave', handlerEnd);
    };

    window.addEventListener('mouseup', handlerEnd);
    window.addEventListener('mouseleave', handlerEnd);
  };
}
