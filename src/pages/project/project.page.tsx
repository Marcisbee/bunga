import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import { useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';

import { CanvasComponent } from '../../components/canvas/canvas.component';
import { ErrorBoundary } from '../../components/error-boundary/error-boundary';
import { LayersComponent } from '../../components/layers/layers.component';
import { StylesComponent } from '../../components/styles/styles.component';
import { allEdges } from '../../store/edges/all-edges';
import { Edge } from '../../store/edges/edge';
import { store } from '../../store/store';

import style from './project.module.scss';

export function ProjectPage() {
  const params = useParams();
  const { setActiveProject } = useStore(store);

  useMemo(() => {
    setActiveProject(params.id!);
  }, []);

  const project = useStore(store.activeProject!);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={style.app}>
        <div style={{ width: 240 }}>
          Project:
          {' '}
          {params.id}
          <hr />

          <ErrorBoundary>
            <LayersComponent />
          </ErrorBoundary>
        </div>

        <div className={style.middle}>
          <div className={style.top}>
            <span style={{ float: 'right' }}>current people</span>
            {allEdges.map((edge) => (
              <button type="button" key={(edge as unknown as Edge).title} onClick={() => project.activeSpace.addEdge(edge)}>
                add
                {' '}
                {(edge as unknown as Edge).title}
              </button>
            ))}
            <button
              type="button"
              key={allEdges[0].name}
              onClick={() => {
                const edgesToSelect: any[] = [];

                new Array(10).fill(0).forEach(() => {
                  edgesToSelect.push(project.activeSpace.addEdge(allEdges[0]));
                });

                new Array(10).fill(0).forEach((_, i) => {
                  const edge = project.activeSpace.addEdge(allEdges[0]);
                  if (i === 0) {
                    edge.position.moveTo(-85, 60);
                  }
                  edgesToSelect.push(edge);
                });

                new Array(10).fill(0).forEach((_, i) => {
                  const edge = project.activeSpace.addEdge(allEdges[0]);
                  if (i === 0) {
                    edge.position.moveTo(-85, 60 + 100 * 1);
                  }
                  edgesToSelect.push(edge);
                });

                new Array(10).fill(0).forEach((_, i) => {
                  const edge = project.activeSpace.addEdge(allEdges[0]);
                  if (i === 0) {
                    edge.position.moveTo(-85, 60 + 100 * 2);
                  }
                  edgesToSelect.push(edge);
                });

                new Array(10).fill(0).forEach((_, i) => {
                  const edge = project.activeSpace.addEdge(allEdges[0]);
                  if (i === 0) {
                    edge.position.moveTo(-85, 60 + 100 * 3);
                  }
                  edgesToSelect.push(edge);
                });

                setTimeout(() => {
                  edgesToSelect.forEach((edge) => {
                    project.activeSpace.move.selectEdge(edge, true);
                  });
                }, 0);
              }}
            >
              add 50x
              {' '}
              {allEdges[0].name}
            </button>
          </div>

          <ErrorBoundary>
            <CanvasComponent
              key={`canvas-${getExomeId(project.activeSpace)}`}
              space={project.activeSpace}
            />
          </ErrorBoundary>
        </div>

        <div style={{ width: 240 }}>
          <ErrorBoundary>
            <StylesComponent />
          </ErrorBoundary>
        </div>
      </div>
    </DndProvider>
  );
}
