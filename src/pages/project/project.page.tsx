import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import { useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';

import { ErrorBoundary } from '../../components/error-boundary/error-boundary';
import { TabSwitchComponent } from '../../components/tab-switch/tab-switch';
import { CanvasToolsComponent } from '../../features/canvas-tools/canvas-tools';
import { CanvasComponent } from '../../features/canvas/canvas.component';
import { LayersManagerComponent } from '../../features/layers-manager/layers-manager';
import { SpacesManagerComponent } from '../../features/spaces-manager/spaces-manager';
import { StylesManagerComponent } from '../../features/styles-manager/styles-manager';
import { TokensManagerComponent } from '../../features/tokens-manager/tokens-manager';
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
          <div style={{ padding: '5px 5px 10px 5px' }}>
            <small>Owner</small>
            <br />
            <strong>
              Project:
              {' '}
              {params.id}
            </strong>
          </div>

          <div style={{ userSelect: 'none' }}>
            <ErrorBoundary>
              <SpacesManagerComponent />
            </ErrorBoundary>

            <ErrorBoundary>
              <LayersManagerComponent />
            </ErrorBoundary>
          </div>
        </div>

        <div className={style.middle}>
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
            <TabSwitchComponent
              value="Styles"
              options={[
                'Styles',
                'Tokens',
              ]}
              render={{
                Styles: <StylesManagerComponent />,
                Tokens: <TokensManagerComponent />,
              }}
            />
          </ErrorBoundary>
        </div>
      </div>
    </DndProvider>
  );
}
