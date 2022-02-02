import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import {
  createElement,
  memo,
  useMemo,
} from 'react';
import { BehaviorSubject } from 'rxjs';

import { ShadowView } from '../../../../components/shadow/shadow.component';
import { useObservable } from '../../../../hooks/use-observable';
import { Connection } from '../../../../store/edges/connection';
import { Edge, EdgeStyles } from '../../../../store/edges/edge';
import { pendingEdge } from '../../../../store/edges/pending';
import { StyleStore } from '../../../../store/style.store';
import { cc } from '../../../../utils/class-names';
import { observableToPromise } from '../../../../utils/observable-to-promise';
import { onMouseMoveDiff } from '../../../../utils/on-mouse-move-diff';
import { stopPropagation } from '../../../../utils/stop-propagation';

import styles from './generic-edge.module.scss';

interface GenericEdgeComponentProps {
  edge: Edge;
}

export const GenericEdgeComponent = memo(({ edge }: GenericEdgeComponentProps) => {
  const {
    input,
    connectableTo,
    output,
    customControls,
  } = useStore(edge);
  const {
    from,
    setFrom,
    unsetFrom,
    connectTo,
  } = useStore(pendingEdge);

  return (
    <div
      className={cc([
        styles.container,
      ])}
      style={{
        '--edge-color': EdgeStyles[edge.style! || 'operation']?.color,
        '--edge-bg': EdgeStyles[edge.style! || 'operation']?.bg,
        '--edge-hr': EdgeStyles[edge.style! || 'operation']?.hr,
      } as React.CSSProperties}
    >
      <div className={styles.head}>
        {edge.style === 'variable' && (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17.313 5.998c.242.216.473.445.687.688l-1.165 1.166-.332-.356-.356-.331 1.166-1.167zm-2.653-1.56c.308.107.608.234.897.378l-.643 1.52c-.167-.088-.341-.168-.52-.239l-.373-.14.639-1.519zm-3.146-.438h.973v1.648l-.487-.018-.486.019v-1.649zm-2.125.419l.631 1.524-.416.153c-.165.067-.326.141-.483.22l-.63-1.524c.288-.142.59-.267.898-.373zm.716 6.829l1.045-1.045-1.463-1.466c.652-.464 1.451-.738 2.313-.738 2.21 0 4 1.791 4 4.001 0 2.209-1.79 3.999-4 3.999s-4-1.79-4-3.999c0-.813.242-1.567.658-2.199l1.447 1.447zm-3.418-5.25l1.167 1.166-.357.331-.332.357-1.165-1.166c.214-.243.445-.472.687-.688zm-1.871 2.443l1.52.641c-.087.168-.168.343-.238.52l-.14.376-1.52-.641c.109-.309.235-.608.378-.896zm-.816 3.07h1.649l-.019.485.019.486h-1.649v-.971zm.42 3.094l1.524-.63.153.417.219.48-1.524.632c-.141-.289-.266-.59-.372-.899zm2.13 3.527l-.688-.687 1.303-1.304.332.356.356.331-1.303 1.304zm2.79 1.43c-.308-.108-.608-.234-.897-.379l.643-1.52c.167.088.341.169.52.239l.375.14-.641 1.52zm3.146.438h-.973v-1.649l.486.019.486-.019v1.649zm2.124-.42l-.63-1.525.415-.152c.165-.066.326-.14.483-.22l.63 1.523c-.287.143-.589.268-.898.374zm2.703-1.586l-1.167-1.165.356-.331.332-.356 1.166 1.165c-.214.244-.445.473-.687.687zm1.871-2.441l-1.521-.643c.087-.168.169-.341.239-.518l.14-.378 1.52.642c-.109.307-.235.608-.378.897zm.816-3.071h-1.649l.019-.486-.019-.485h1.649v.971zm-1.944-2.464l-.153-.416-.219-.483 1.524-.629c.141.288.266.59.372.897l-1.524.631zm-6.056-8.018c5.514 0 10 4.486 10 10s-4.486 9.999-10 9.999-10-4.485-10-9.999 4.486-10 10-10zm0-2c-6.632 0-12 5.366-12 12 0 6.631 5.367 11.999 12 11.999 6.632 0 12-5.366 12-11.999 0-6.632-5.367-12-12-12z" /></svg>
        )}
        {edge.style === 'operation' && (
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fillRule="evenodd" clipRule="evenodd"><path fill="currentColor" d="M5.829 6c-.412 1.165-1.524 2-2.829 2-1.656 0-3-1.344-3-3s1.344-3 3-3c1.305 0 2.417.835 2.829 2h13.671c2.484 0 4.5 2.016 4.5 4.5s-2.016 4.5-4.5 4.5h-4.671c-.412 1.165-1.524 2-2.829 2-1.305 0-2.417-.835-2.829-2h-4.671c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5h13.671c.412-1.165 1.524-2 2.829-2 1.656 0 3 1.344 3 3s-1.344 3-3 3c-1.305 0-2.417-.835-2.829-2h-13.671c-2.484 0-4.5-2.016-4.5-4.5s2.016-4.5 4.5-4.5h4.671c.412-1.165 1.524-2 2.829-2 1.305 0 2.417.835 2.829 2h4.671c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5h-13.671zm6.171 5c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1z" /></svg>
        )}
        {edge.style === 'style' && (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.58 0c-1.234 0-2.377.616-3.056 1.649-.897 1.37-.854 3.261-1.368 4.444-.741 1.708-3.873.343-5.532-.524-2.909 5.647-5.025 8.211-6.845 10.448 6.579 4.318 1.823 1.193 12.19 7.983 2.075-3.991 4.334-7.367 6.825-10.46-1.539-1.241-4.019-3.546-2.614-4.945 1-1 2.545-1.578 3.442-2.95 1.589-2.426-.174-5.645-3.042-5.645zm-5.348 21.138l-1.201-.763c0-.656.157-1.298.422-1.874-.609.202-1.074.482-1.618 1.043l-3.355-2.231c.531-.703.934-1.55.859-2.688-.482.824-1.521 1.621-2.331 1.745l-1.302-.815c1.136-1.467 2.241-3.086 3.257-4.728l8.299 5.462c-1.099 1.614-2.197 3.363-3.03 4.849zm6.724-16.584c-.457.7-2.445 1.894-3.184 2.632-.681.68-1.014 1.561-.961 2.548.071 1.354.852 2.781 2.218 4.085-.201.265-.408.543-.618.833l-8.428-5.548.504-.883c1.065.445 2.1.678 3.032.678 1.646 0 2.908-.733 3.464-2.012.459-1.058.751-3.448 1.206-4.145 1.206-1.833 3.964-.017 2.767 1.812zm-.644-.424c-.265.41-.813.523-1.22.257-.409-.267-.522-.814-.255-1.223.267-.409.813-.524 1.222-.257.408.266.521.817.253 1.223z" /></svg>
        )}
        {edge.style === 'element' && (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9.916 8.195h-.013v.961c-.034 1.598 4.213 1.601 4.161 0v-.96c-.123-1.511-4.042-1.52-4.148-.001zm2.08.71c-.723 0-1.311-.253-1.311-.564 0-.312.588-.564 1.311-.564.724 0 1.311.253 1.311.564 0 .311-.587.564-1.311.564zm6.421-2.155v-.96c-.124-1.511-4.042-1.52-4.148-.001h-.013v.961c-.034 1.599 4.214 1.602 4.161 0zm-2.067-1.379c.723 0 1.311.253 1.311.564s-.589.565-1.311.565c-.724 0-1.311-.253-1.311-.564s.587-.565 1.311-.565zm-10.797.418h-.013v.961c-.034 1.598 4.213 1.601 4.161 0v-.96c-.123-1.511-4.042-1.519-4.148-.001zm2.08.711c-.723 0-1.311-.253-1.311-.564s.588-.565 1.311-.565c.724 0 1.311.253 1.311.564s-.588.565-1.311.565zm2.283-2.988l-.013.201v.759c-.034 1.598 4.214 1.602 4.161 0v-.959c-.124-1.512-4.042-1.52-4.148-.001zm3.392.145c0 .311-.588.564-1.311.564-.724 0-1.311-.253-1.311-.564s.587-.564 1.311-.564c.723 0 1.311.253 1.311.564zm-1.308-3.657l-11 6 .009.019-.009-.005v12.118l11 5.868 11-5.869v-12.055l-11-6.076zm-1 21l-8-4.268v-7.133l8 4.401v7zm-8.885-14.464l9.882-5.396 9.917 5.458-9.896 5.385-9.903-5.447zm10.885 7.464l8-4.353v7.085l-8 4.268v-7z" /></svg>
        )}
        {edge.title}
      </div>

      <div className={styles.content}>
        <ul className={styles.controls}>
          {Object.keys(input).map((key) => (
            <li key={`edge-i-${getExomeId(edge)}-${key}`}>
              <span>
                {!!connectableTo[key] && (
                  <span
                    role="button"
                    className={styles.input}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onMouseUp={async () => {
                      const connection = await observableToPromise<Connection>(input[key]);

                      if (connection) {
                        connection.disconnect(key, edge);
                      }

                      if (from) {
                        connectTo(key, edge);
                      }
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 18 18"
                      // @TODO: figure out how to change this based on observable value
                      fill={input[key].getValue() ? 'currentColor' : 'none'}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="3" />
                    </svg>
                  </span>
                )}
                { key !== 'default' ? key : (
                  <span
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: '&nbsp;' }}
                  />
                )}
              </span>
              <div
                onMouseDown={stopPropagation}
                onMouseMove={stopPropagation}
                onKeyDown={stopPropagation}
                onKeyUp={stopPropagation}
              >
                {!connectableTo[key] ? (
                  customControls?.[key] ? (
                    createElement(customControls[key])
                  ) : (
                    <input
                      type="text"
                      defaultValue={input[key]!.getValue()}
                      onChange={(event) => {
                        input[key]!.next(event.target.value);
                      }}
                      // eslint-disable-next-line jsx-a11y/no-autofocus
                      // @TODO: Figure out autofocus
                      // autoFocus={(edge as any).autoFocus}
                      style={{
                        fontSize: 11,
                        width: 80,
                        padding: 1,
                        border: 0,
                        borderRadius: 2,
                        backgroundColor: '#fff',
                        fontWeight: 'bold',
                      }}
                    />
                  )
                ) : (
                  <span>
                    {input[key] && (
                      <EdgeOutput input={input[key]} />
                    )}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>

        {edge.render && (
          <div className={styles.preview}>
            <ShadowView>
              <edge.render />
            </ShadowView>
          </div>
        )}

        <div className={styles.outputGroup}>
          {Object.keys(output).map((key) => (
            <div key={`edge-o-${getExomeId(edge)}-${key}`}>
              {key !== 'default' && (
                <strong>{key}</strong>
              )}

              {/* <span><EdgeOutputConnection edge={edge} id={key} /></span> */}
              <span
                role="button"
                tabIndex={0}
                className={styles.output}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setFrom(key, edge);

                  onMouseMoveDiff((diffX, diffY) => {
                    const x = pendingEdge.position.x + diffX;
                    const y = pendingEdge.position.y + diffY;

                    if (pendingEdge.position.x === x && pendingEdge.position.y === y) {
                      return;
                    }

                    pendingEdge.position.moveTo(x, y);
                  }, () => {
                    unsetFrom();
                  })(e);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 19 13" fill={output[key].to.length > 0 ? 'currentColor' : 'none'} xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.73223 10.6109L2.88909 5.76777C1.31418 4.19286 2.42959 1.5 4.65686 1.5H14.3431C16.5704 1.5 17.6858 4.19285 16.1109 5.76777L11.2678 10.6109C10.2915 11.5872 8.70854 11.5872 7.73223 10.6109Z" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}, () => true);

interface EdgeOutputProps {
  input: BehaviorSubject<Connection | null>;
}

function EdgeOutput({ input }: EdgeOutputProps): React.ReactElement | null {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const inputConnection = useObservable(useMemo(() => input, []));

  if (inputConnection instanceof Connection) {
    return (
      <EdgeOutputConnection
        edge={inputConnection.from}
        id={inputConnection.path}
      />
    );
  }

  return null;
}

function EdgeOutputConnection({ edge, id }: { edge: Edge, id: string }): React.ReactElement {
  const { select } = useStore(edge);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useObservable(useMemo(() => select[id], [id]));

  if (value instanceof StyleStore) {
    return value.name as unknown as React.ReactElement;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (item instanceof StyleStore) {
          return item.name as unknown as React.ReactElement;
        }

        return (String(item == null ? '' : item));
      })
      .join(', ') as unknown as React.ReactElement;
  }

  return (String(value == null ? '' : value)) as unknown as React.ReactElement;
}
