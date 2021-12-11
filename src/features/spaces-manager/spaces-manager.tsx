import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import { useState } from 'react';

import { SpaceStore } from '../../store/space.store';
import { store } from '../../store/store';
import paneStyle from '../../styles/pane.module.scss';
import { cc } from '../../utils/class-names';

import style from './spaces-manager.module.scss';

function SingleSpacesManagerComponent({ space }: { space: SpaceStore }) {
  const {
    activeSpace,
    setActiveSpace,
  } = useStore(store.activeProject!);
  const { name, rename } = useStore(space);

  const [isRenameMode, setIsRenameMode] = useState(false);

  return (
    <div
      role="button"
      className={cc([
        style.item,
        activeSpace === space && style.active,
      ])}
      onClick={() => setActiveSpace(space)}
      onDoubleClick={() => setIsRenameMode(true)}
    >
      <span className={style.itemName}>
        {isRenameMode ? (
          <input
            type="text"
            value={name}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onChange={(e) => {
              rename(e.target.value);
            }}
            onBlur={() => {
              setIsRenameMode(false);
            }}
            onKeyDown={(e) => {
              e.stopPropagation();

              if (e.key === 'Enter') {
                setIsRenameMode(false);
                return;
              }

              if (e.key === 'Escape') {
                setIsRenameMode(false);
              }
            }}
          />
        ) : (
          name
        )}
      </span>
    </div>
  );
}

export function SpacesManagerComponent() {
  const {
    spaces,
    activeSpace,
    removeSpace,
    addSpace,
  } = useStore(store.activeProject!);

  return (
    <div
      className={paneStyle.pane}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
          e.preventDefault();
          e.stopPropagation();

          // Can't remove the last space.
          if (spaces.length <= 1) {
            return false;
          }

          removeSpace(activeSpace);

          return false;
        }
      }}
    >
      <div className={paneStyle.header}>
        <strong>Spaces</strong>
        <button
          type="button"
          onClick={() => addSpace()}
        >
          +
        </button>
      </div>

      <div className={style.list}>
        {spaces.map((space) => (
          <SingleSpacesManagerComponent
            key={`layer-space-${getExomeId(space)}`}
            space={space}
          />
        ))}
      </div>
    </div>
  );
}
