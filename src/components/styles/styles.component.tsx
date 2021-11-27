import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import { useState } from 'react';

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

function StylesManagerComponent() {
  const { activeStyle, addStyle, styles } = useStore(store.activeProject!);
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
          {styles.map((style) => (
            <ListStylesComponent
              key={`style-list-${getExomeId(style)}`}
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

function TokensManagerComponent() {
  const project = useStore(store.activeProject!);
  // @TODO: Add more tokens?? (figure out how this would work UX wise)
  const { name, tokens, setName, setTokens } = useStore(project.tokens[0]);

  return (
    <div>
      <div>
        <strong>Tokens manager</strong>
      </div>

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
          value={tokens}
          onChange={(e) => {
            setTokens(e.target.value);
          }}
        />
      </div>
    </div>
  );
}

export function StylesComponent() {
  const [tab, setTab] = useState('styles');

  return (
    <div>
      <div>
        <button onClick={() => setTab('styles')}>
          {tab === 'styles' && '!'}Styles
        </button>
        <button onClick={() => setTab('tokens')}>
          {tab === 'tokens' && '!'}Tokens
        </button>
      </div>
      <div>
        {tab === 'styles' && (
          <StylesManagerComponent />
        )}
        {tab === 'tokens' && (
          <TokensManagerComponent />
        )}
      </div>
    </div>
  );
}
