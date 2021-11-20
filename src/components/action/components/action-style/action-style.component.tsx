import { getExomeId } from 'exome';
import { useStore } from 'exome/react';

import { ActionStyleStore, activeActionConnection } from '../../../../store/action.store';
import { store } from '../../../../store/store';
import { StyleStore } from '../../../../store/style.store';
import { ShadowView } from '../../../shadow/shadow.component';

import styles from './action-style.module.scss';

interface ActionStyleComponentProps {
  action: ActionStyleStore;
}

function ActionStylePreviewStyleComponent({ style }: { style: StyleStore }) {
  const { css } = useStore(style);

  return (
    <style>{`#obj { ${css}}`}</style>
  );
}

function ActionStylePreviewComponent({ style }: { style?: StyleStore }) {
  return (
    <div className={styles.preview}>
      <ShadowView>
        {!!style && (
          <ActionStylePreviewStyleComponent
            style={style}
          />
        )}
        <div>
          <div id="obj">Hello</div>
        </div>
      </ShadowView>
    </div>
  );
}

// @TODO: Design action nodes.
export function ActionStyleComponent({ action }: ActionStyleComponentProps) {
  const { style, setStyle } = useStore(action);
  const { styles: stylesList } = useStore(store.activeSpace!);
  const { setFrom } = useStore(activeActionConnection);

  return (
    <div className={styles.container} tabIndex={0}>
      {/* @TODO: Cleanup styles */}
      <div className={styles.head}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.58 0c-1.234 0-2.377.616-3.056 1.649-.897 1.37-.854 3.261-1.368 4.444-.741 1.708-3.873.343-5.532-.524-2.909 5.647-5.025 8.211-6.845 10.448 6.579 4.318 1.823 1.193 12.19 7.983 2.075-3.991 4.334-7.367 6.825-10.46-1.539-1.241-4.019-3.546-2.614-4.945 1-1 2.545-1.578 3.442-2.95 1.589-2.426-.174-5.645-3.042-5.645zm-5.348 21.138l-1.201-.763c0-.656.157-1.298.422-1.874-.609.202-1.074.482-1.618 1.043l-3.355-2.231c.531-.703.934-1.55.859-2.688-.482.824-1.521 1.621-2.331 1.745l-1.302-.815c1.136-1.467 2.241-3.086 3.257-4.728l8.299 5.462c-1.099 1.614-2.197 3.363-3.03 4.849zm6.724-16.584c-.457.7-2.445 1.894-3.184 2.632-.681.68-1.014 1.561-.961 2.548.071 1.354.852 2.781 2.218 4.085-.201.265-.408.543-.618.833l-8.428-5.548.504-.883c1.065.445 2.1.678 3.032.678 1.646 0 2.908-.733 3.464-2.012.459-1.058.751-3.448 1.206-4.145 1.206-1.833 3.964-.017 2.767 1.812zm-.644-.424c-.265.41-.813.523-1.22.257-.409-.267-.522-.814-.255-1.223.267-.409.813-.524 1.222-.257.408.266.521.817.253 1.223z" /></svg>
        Style
      </div>

      <ul className={styles.controls}>
        <li>
          <span>
            <span
              className={styles.input}
              onClick={() => {
                setFrom(action.connections[0]);
                console.log('Listening for connection', action.connections[0]);
              }}
            />
            Source
          </span>
          <span>
            <select
              value={style ? getExomeId(style) : ''}
              onChange={(e) => {
                const selectedStyle = stylesList.find((s) => getExomeId(s) === e.target.value)!;

                setStyle(selectedStyle);
              }}
              style={{
                border: 0,
                borderRadius: 3,
                fontSize: 12,
              }}
            >
              <option value="" disabled>Choose style</option>
              {/* @TODO: Separate all options into separate components that listen each style changes. */}
              {stylesList.map((style) => (
                <option value={getExomeId(style)}>{style.name}</option>
              ))}
            </select>
          </span>
        </li>
      </ul>

      <ActionStylePreviewComponent style={style} />

      <div className={styles.outputGroup}>
        <div>
          <strong>then</strong>
          <span
            className={styles.output}
            onClick={() => {
              setFrom(action.connections[0]);
              console.log('Listening for connection', action.connections[0]);
            }}
          >
            <svg width="14" height="14" viewBox="0 0 19 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.73223 10.6109L2.88909 5.76777C1.31418 4.19286 2.42959 1.5 4.65686 1.5H14.3431C16.5704 1.5 17.6858 4.19285 16.1109 5.76777L11.2678 10.6109C10.2915 11.5872 8.70854 11.5872 7.73223 10.6109Z" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
        </div>
        <div>
          <strong>else</strong>
          <span
            className={styles.output}
            onClick={() => {
              setFrom(action.connections[0]);
              console.log('Listening for connection', action.connections[0]);
            }}
          >
            <svg width="14" height="14" viewBox="0 0 19 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.73223 10.6109L2.88909 5.76777C1.31418 4.19286 2.42959 1.5 4.65686 1.5H14.3431C16.5704 1.5 17.6858 4.19285 16.1109 5.76777L11.2678 10.6109C10.2915 11.5872 8.70854 11.5872 7.73223 10.6109Z" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
