import { useStore } from 'exome/react';

import { store } from '../../store/store';
import { ActiveStyleStore, StyleStore } from '../../store/style.store';

function ActiveStylesComponent({ active }: { active: StyleStore }) {
  const { name, css, setName, setCss } = useStore(active);

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <textarea
        style={{ width: '100%' }}
        rows={10}
        value={css}
        onChange={(e) => {
          setCss(e.target.value);
        }}
      />
    </div>
  );
}

function ListStylesComponent({ activeStyle, style }: { activeStyle: ActiveStyleStore, style: StyleStore }) {
  const { active, setActive } = useStore(activeStyle);
  const { name } = useStore(style);

  return (
    <div onClick={() => setActive(style)}>
      {active === style && '!'} {name}
    </div>
  );
}

export function StylesComponent() {
  const { activeStyle, addStyle } = useStore(store.activeSpace!);
  const { active } = useStore(activeStyle);

  return (
    <div>
      <div>
        <strong>Styles manager</strong>
        <button
          onClick={addStyle}
          style={{ float: 'right' }}
        >
          +
        </button>
        <div style={{ minHeight: 200 }}>
          {store.activeSpace!.styles.map((style) => (
            <ListStylesComponent
              activeStyle={activeStyle}
              style={style}
            />
          ))}
        </div>
      </div>

      <div>
        <hr />
        {!!active && (
          <ActiveStylesComponent active={active} />
        )}
      </div>
    </div>
  );
}
