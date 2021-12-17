import { useStore } from 'exome/react';
import { Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSuspense } from 'use-react-suspense';

import { Footer } from '../../layouts/dashboard/footer/footer';
import { Header } from '../../layouts/dashboard/header/header';
import { store } from '../../store/store';

function ProjectsList() {
  const navigate = useNavigate();
  const { projectsDetails, createProject } = useStore(store);

  useSuspense(store.getProjects, [], { cacheTime: 10000 });

  const projectIds = Object.keys(projectsDetails);

  return (
    <div>
      {projectIds.length > 0 ? (
        projectIds.map((projectId) => (
          <div key={`project-${projectId}`}>
            <Link to={`/project/${projectId}`}>{projectsDetails[projectId].title}</Link>
          </div>
        ))
      ) : (
        <div>
          No projects
        </div>
      )}
      <hr />
      <button
        type="button"
        onClick={async () => {
          const newId = await createProject();

          navigate(`/project/${newId}`);
        }}
      >
        + Create project
      </button>
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
      </div>
      <Footer />
    </div>
  );
}
