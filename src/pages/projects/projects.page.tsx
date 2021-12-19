import { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProjectsListComponent } from '../../features/projects-list/projects-list';
import { Footer } from '../../layouts/dashboard/footer/footer';
import { Header } from '../../layouts/dashboard/header/header';
import { store } from '../../store/store';
import gridStyle from '../../styles/grid.module.scss';

export function ProjectsPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div>
        <div className={gridStyle.wrapper}>
          <h1>Projects</h1>

          <button
            type="button"
            onClick={async () => {
              const newId = await store.createProject();

              navigate(`/project/${newId}`);
            }}
          >
            + Create project
          </button>

          <br />

          <Suspense fallback={<div>Loading...</div>}>
            <ProjectsListComponent />
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  );
}
