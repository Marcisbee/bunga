import { getExomeId } from 'exome';
import { useStore } from 'exome/react';

import { store } from '../../store/store';
import { ActiveStyleStore, StyleStore } from '../../store/style.store';
import paneStyle from '../../styles/pane.module.scss';
import { cc } from '../../utils/class-names';

import style from './styles-manager.module.scss';

function ActiveStylesComponent({ active }: { active: StyleStore }) {
  const {
    name,
    css,
    setName,
    setCss,
  } = useStore(active);

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        style={{ width: '100%' }}
      />
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
  const { name } = useStore(styleStore);

  return (
    <div
      role="button"
      className={cc([
        style.item,
        style.text,
        active === styleStore && style.active,
      ])}
      onClick={() => setActive(styleStore)}
    >
      {name}
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
