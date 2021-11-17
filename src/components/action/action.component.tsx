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
    <>
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
      <svg
        width="611"
        height="500"
        className="react-flow__edges"
      >
        <defs>
          <marker
            className="react-flow__arrowhead"
            id="react-flow__arrowclosed"
            markerWidth="12.5"
            markerHeight="12.5"
            viewBox="-10 -10 20 20"
            orient="auto"
            refX="0"
            refY="0"
          >
            <polyline stroke="#b1b1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" fill="#b1b1b7" points="-5,-4 0,0 -5,4 -5,-4"></polyline>
          </marker>
          <marker
            className="react-flow__arrowhead"
            id="react-flow__arrow"
            markerWidth="12.5"
            markerHeight="12.5"
            viewBox="-10 -10 20 20"
            orient="auto"
            refX="0"
            refY="0"
          >
            <polyline stroke="#b1b1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" fill="none" points="-5,-4 0,0 -5,4"></polyline>
          </marker>
        </defs>
        <g transform="translate(-7.417973330832865,217.92908512897452) scale(0.5)">
          <g className="react-flow__edge react-flow__edge-default animated">
            <path d="M630,37 C676,37 676,201.5 722,201.5" className="react-flow__edge-path" marker-end="none"></path>
          </g>
          <g className="react-flow__edge react-flow__edge-default animated">
            <path d="M580,182 C651,182 651,201.5 722,201.5" className="react-flow__edge-path" marker-end="none"></path>
          </g>
          <g className="react-flow__edge react-flow__edge-default animated">
            <path d="M700,332 C711,332 711,201.5 722,201.5" className="react-flow__edge-path" marker-end="none"></path>
          </g>
        </g>
      </svg>
    </>
  );
}
