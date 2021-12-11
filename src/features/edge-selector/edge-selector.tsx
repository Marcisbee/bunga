import { useLayoutEffect, useMemo, useState } from 'react';

import { allEdges, EdgeConstructor, edgeGroups } from '../../store/edges/all-edges';
import { Edge } from '../../store/edges/edge';
import { store } from '../../store/store';
import { cc } from '../../utils/class-names';

import style from './edge-selector.module.scss';

interface EdgeSelectorComponentProps {
  onClose: () => void;
}

export function EdgeSelectorComponent({ onClose }: EdgeSelectorComponentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredEdgeList = useMemo(() => {
    const normalizedSearchTerm = searchTerm
      .trim()
      .replace(/ +/g, ' ')
      .split(' ')
      .map((term) => (
        new RegExp(term, 'i')
      ));

    return allEdges
      .filter((edge) => {
        const text = (edge as unknown as Edge).title;

        for (const regex of normalizedSearchTerm) {
          if (!regex.test(text)) {
            return false;
          }
        }

        return true;
      });
  }, [searchTerm]);
  const [active, setActive] = useState<EdgeConstructor | null>(() => filteredEdgeList[0]);

  useLayoutEffect(() => {
    if (filteredEdgeList.length === 0) {
      setActive(null);
      return;
    }

    if (filteredEdgeList.indexOf(active!) > -1) {
      return;
    }

    setActive(() => filteredEdgeList[0]);
  }, [active, filteredEdgeList]);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={style.popup}
    >
      <div className={style.search}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.145 18.29c-5.042 0-9.145-4.102-9.145-9.145s4.103-9.145 9.145-9.145 9.145 4.103 9.145 9.145-4.102 9.145-9.145 9.145zm0-15.167c-3.321 0-6.022 2.702-6.022 6.022s2.702 6.022 6.022 6.022 6.023-2.702 6.023-6.022-2.702-6.022-6.023-6.022zm9.263 12.443c-.817 1.176-1.852 2.188-3.046 2.981l5.452 5.453 3.014-3.013-5.42-5.421z" /></svg>
        <input
          type="search"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          placeholder="Search edges.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (!active) {
              return;
            }

            e.stopPropagation();

            if (e.key === 'Enter') {
              store.activeProject!.activeSpace.addEdge(active);
              onClose();
              return;
            }

            if (e.key === 'Escape') {
              // If search input has value in it, then it will be cleared by pressing
              // Escape key, hence we should not close content panel.
              if ((e.target as HTMLInputElement).value) {
                return;
              }

              onClose();
              return;
            }

            if (e.key === 'ArrowUp') {
              const currentIndex = filteredEdgeList.indexOf(active);
              const previousIndex = currentIndex - 1;

              if (!filteredEdgeList[previousIndex]) {
                return;
              }

              e.preventDefault();
              setActive(() => filteredEdgeList[previousIndex]);
            }

            if (e.key === 'ArrowDown') {
              const currentIndex = filteredEdgeList.indexOf(active);
              const nextIndex = currentIndex + 1;

              if (!filteredEdgeList[nextIndex]) {
                return;
              }

              e.preventDefault();
              setActive(() => filteredEdgeList[nextIndex]);
            }
          }}
        />
      </div>

      <div className={style.results}>
        <div className={style.list}>
          {filteredEdgeList.length === 0 ? (
            <div className={style.noResults}>
              <p>No results</p>
            </div>
          ) : (
            <>
              {Object.entries(edgeGroups)
                .map(([group, edges]) => {
                  const filteredEdges = edges
                    .filter((edge) => filteredEdgeList.indexOf(edge) !== -1);

                  if (filteredEdges.length === 0) {
                    return null;
                  }

                  return (
                    <div key={`edge-selector-${group}`}>
                      <strong>
                        {group.toUpperCase()}
                      </strong>
                      {filteredEdges.map((edge) => (
                        // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                        <button
                          key={`edge-selector-${group}-${(edge as unknown as Edge).title}`}
                          type="button"
                          onMouseOver={() => {
                            setActive(() => edge);
                          }}
                          onClick={() => {
                            store.activeProject!.activeSpace.addEdge(edge);
                            onClose();
                          }}
                          className={cc([
                            active === edge && style.active,
                          ])}
                        >
                          {(edge as unknown as Edge).title}
                        </button>
                      ))}
                    </div>
                  );
                })}
            </>
          )}
        </div>

        <div className={style.preview}>
          {!active ? (
            <div className={style.noResults} />
          ) : (
            <div>
              <br />
              <br />
              Preview of
              {' "'}
              {(active as unknown as Edge).title}
              {'" '}
              Edge
              <br />
              <button
                type="button"
                onClick={() => {
                  store.activeProject!.activeSpace.addEdge(active);
                  onClose();
                }}
              >
                Use
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
