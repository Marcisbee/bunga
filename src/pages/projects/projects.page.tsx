import { useStore } from 'exome/react';
import { Suspense, useMemo } from 'react';
import usePromise from 'react-use-promise';

import { Footer } from '../../layouts/dashboard/footer/footer';
import { Header } from '../../layouts/dashboard/header/header';
import { store } from '../../store/store';

function ProjectsList() {
  const { projects } = useStore(store);

  // Load projects
  usePromise(
    useMemo(() => store.getProjects(), []),
    [],
  );

  const projectIds = Object.keys(projects);

  return (
    <div>
      {projectIds.length > 0 ? (
        projectIds.map((projectId) => (
          <div>
            {projectId}
          </div>
        ))
      ) : (
        <div>
          No projects
        </div>
      )}
    </div>
  );
}

export function ProjectsPage() {
  return (
    <div>
      <Header />
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectsList />
        </Suspense>
        {/* <Link to="/project/123">Project 123</Link> */}
      </div>
      <Footer />
    </div>
  );
}
