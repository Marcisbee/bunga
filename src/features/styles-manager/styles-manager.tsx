import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import { useState } from 'react';

import { store } from '../../store/store';
import { ActiveStyleStore, StyleStore } from '../../store/style.store';
import paneStyle from '../../styles/pane.module.scss';
import { cc } from '../../utils/class-names';

import style from './styles-manager.module.scss';

function ActiveStylesComponent({ active }: { active: StyleStore }) {
  const {
    css,
    setCss,
  } = useStore(active);

  return (
    <div>
      <textarea
        style={{ width: '100%', resize: 'vertical' }}
        rows={10}
        value={css}
        onChange={(e) => {
          setCss(e.target.value);
        }}
      />
    </div>
  );
}

function ListStylesComponent({
  activeStyle,
  styleStore,
}: { activeStyle: ActiveStyleStore, styleStore: StyleStore }) {
  const { active, setActive } = useStore(activeStyle);
  const { name, setName } = useStore(styleStore);

  const [isRenameMode, setIsRenameMode] = useState(false);

  return (
    <div
      role="button"
      className={cc([
        style.item,
        style.text,
        active === styleStore && style.active,
      ])}
      onClick={() => {
        if (styleStore === active) {
          return;
        }

        setActive(styleStore);
      }}
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
              setName(e.target.value);
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

export function StylesManagerComponent() {
  const { activeStyle, addStyle, styles } = useStore(store.activeProject!);
  const { active } = useStore(activeStyle);

  return (
    <>
      <div className={paneStyle.pane}>
        <div className={paneStyle.header}>
          <strong>Styles</strong>
          <button
            type="button"
            onClick={addStyle}
          >
            +
          </button>
        </div>

        <div className={style.list}>
          {styles.map((styleStore) => (
            <ListStylesComponent
              key={`style-list-${getExomeId(styleStore)}`}
              activeStyle={activeStyle}
              styleStore={styleStore}
            />
          ))}
        </div>
      </div>

      <div className={paneStyle.pane}>
        <div>
          {!!active && (
            <ActiveStylesComponent active={active} />
          )}
        </div>
      </div>
    </>
  );
}
