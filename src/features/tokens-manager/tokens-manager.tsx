import { useStore } from 'exome/react';

import { store } from '../../store/store';
import paneStyle from '../../styles/pane.module.scss';

import style from './tokens-manager.module.scss';

export function TokensManagerComponent() {
  const project = useStore(store.activeProject!);
  // @TODO: Add more tokens?? (figure out how this would work UX wise)
  const {
    name,
    tokens,
    setName,
    setTokens,
  } = useStore(project.tokens[0]);

  return (
    <div className={paneStyle.pane}>
      <div className={paneStyle.header}>
        <strong>Tokens</strong>
      </div>

      <div>
        <input
          type="text"
          value={name}
          style={{ width: '100%' }}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <textarea
          style={{ width: '100%', resize: 'vertical' }}
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
