import { useStore } from 'exome/react';
import { Link } from 'react-router-dom';
import { useSuspense } from 'use-react-suspense';

import { store } from '../../store/store';
import gridStyle from '../../styles/grid.module.scss';

import style from './projects-list.module.scss';

export function ProjectsListComponent() {
  const { projectsDetails } = useStore(store);

  useSuspense(store.getProjects, []);

  const projectIds = Object.keys(projectsDetails);

  return (
    <div>
      {projectIds.length > 0 ? (
        <div className={gridStyle.grid}>
          {projectIds.map((projectId) => {
            const updateAt = new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            })
              .format(projectsDetails[projectId].updatedAt);

            return (
              <Link
                key={`project-${projectId}`}
                to={`/project/${projectId}`}
                className={style.project}
              >
                <div className={style.preview} />
                <div className={style.meta}>
                  <strong>{projectsDetails[projectId].title}</strong>
                  <span>
                    {`Last updated ${updateAt}`}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div>
          No projects
        </div>
      )}
    </div>
  );
}
