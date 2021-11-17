import { useStore } from 'exome/react';
import { ActionStore, ActionStyleStore } from '../../store/action.store';

import { store } from '../../store/store';
import { cc } from '../../utils/class-names';

import { activeStyle, actionStyleStyle } from './action.css';
import { ActionStyleComponent } from './components/action-style/action-style.component';

interface ActionComponentProps {
  action: ActionStore;
}

export function ActionComponent({ action }: ActionComponentProps) {
  const { x, y, width, height, moveTo } = useStore(action.position);
  const { active, setActive } = useStore(store.activeSpace!.activeComponent!);

  const isActive = active === action;

  return (
    <div
      className={cc([
        actionStyleStyle,
        isActive && activeStyle,
      ])}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        // setActive(action);
      }}
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
        width,
        height,
      }}
      tabIndex={0}
      onKeyDown={(e) => {
        const modifier = e.shiftKey ? 30 : 10;

        if (!e.key.startsWith('Arrow')) {
          return;
        }

        if (e.key === 'ArrowUp') {
          moveTo(x, y - modifier);
        }

        if (e.key === 'ArrowDown') {
          moveTo(x, y + modifier);
        }

        if (e.key === 'ArrowLeft') {
          moveTo(x - modifier, y);
        }

        if (e.key === 'ArrowRight') {
          moveTo(x + modifier, y);
        }

        e.preventDefault();
        e.stopPropagation();
        store.activeSpace!.boundary.updateBoundary();
      }}
    >
      {action instanceof ActionStyleStore && (
        <ActionStyleComponent action={action} />
      )}
    </div>
  );
}
