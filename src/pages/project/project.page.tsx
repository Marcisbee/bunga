import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import { useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';

import { ErrorBoundary } from '../../components/error-boundary/error-boundary';
import { CanvasToolsComponent } from '../../features/canvas-tools/canvas-tools';
import { CanvasComponent } from '../../features/canvas/canvas.component';
import { EdgeSelectorComponent } from '../../features/edge-selector/edge-selector';
import { LayersComponent } from '../../layouts/app/layers/layers.component';
import { StylesComponent } from '../../layouts/app/styles/styles.component';
import { store } from '../../store/store';

import style from './project.module.scss';

export function ProjectPage() {
  const params = useParams();
  const { setActiveProject } = useStore(store);

  useMemo(() => {
    setActiveProject(params.id!);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <EdgeSelectorComponent />
          <CanvasToolsComponent />

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
