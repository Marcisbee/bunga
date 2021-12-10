import { getExomeId } from 'exome';
import { useStore } from 'exome/react';

import { store } from '../../store/store';
import paneStyle from '../../styles/pane.module.scss';
import { cc } from '../../utils/class-names';

import style from './spaces-manager.module.scss';

export function SpacesManagerComponent() {
  const {
    spaces,
    activeSpace,
    addSpace,
    setActiveSpace,
    removeSpace,
  } = useStore(store.activeProject!);

  return (
    <div className={paneStyle.pane}>
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
          <div
            key={`layer-space-${getExomeId(space)}`}
            role="button"
            onClick={() => setActiveSpace(space)}
            className={cc([
              style.item,
              activeSpace === space && style.active,
            ])}
          >
            {space.name}

            {spaces.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeSpace(space);
                }}
              >
                x
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
