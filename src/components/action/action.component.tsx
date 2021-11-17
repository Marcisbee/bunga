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
      // onClick={(e) => {
      //   e.preventDefault();
      //   e.stopPropagation();
      //   setActive(component);
      // }}
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
        width,
        height,
      }}
    >
      {action instanceof ActionStyleStore && (
        <ActionStyleComponent action={action} />
      )}
      <div>
        <input
          type="number"
          defaultValue={x}
          style={{ width: 50 }}
          step={10}
          onChange={(e) => {
            moveTo(parseInt(e.target.value, 10), y);
            store.activeSpace!.boundary.updateBoundary();
          }}
        />
        <input
          type="number"
          defaultValue={y}
          style={{ width: 50 }}
          step={10}
          onChange={(e) => {
            moveTo(x, parseInt(e.target.value, 10));
            store.activeSpace!.boundary.updateBoundary();
          }}
        />
      </div>
    </div>
  );
}
