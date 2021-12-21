import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Link, useParams } from 'react-router-dom';
import { useSuspense } from 'use-react-suspense';

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

function ProjectInfo() {
  const project = useStore(store.activeProject!);

  return (
    <div style={{ padding: '5px 5px 10px 5px' }}>
      <Link to="/projects">Back to projects</Link>
      <br />
      {/* <small>Owner</small>
            <br /> */}
      <strong>
        <input
          value={project.name}
          onChange={(e) => {
            project.rename(e.target.value);
          }}
          style={{ width: '100%', border: 'none' }}
        />
      </strong>
      <br />
      <button type="button" onClick={project.save}>
        Save
      </button>
    </div>
  );
}

function ProjectCanvas() {
  const project = useStore(store.activeProject!);

  return (
    <CanvasComponent
      key={`canvas-${getExomeId(project.activeSpace)}`}
      space={project.activeSpace}
    />
  );
}

export function ProjectPage() {
  const params = useParams();

  useSuspense(store.getProjectById, [params.id!]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={style.app}>
        <div style={{ width: 240 }}>
          <ProjectInfo />

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
            <ProjectCanvas />
          </ErrorBoundary>
        </div>

        <div style={{ width: 240, userSelect: 'none' }}>
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
