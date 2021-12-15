import { gql } from '@urql/core';
import { Exome, addMiddleware, registerLoadable } from 'exome';
import { exomeDevtools } from 'exome/devtools';

import { ProjectDetailsStore, ProjectStore } from './project.store';
import { UserStore } from './user.store';

// Enable devtools in dev mode
if (process.env.NODE_ENV !== 'production') {
  addMiddleware(
    exomeDevtools({
      name: 'Codename: Facade app',
      maxAge: 30,
    }),
  );
}

export class Store extends Exome {
  public user = new UserStore();

  public projects: Record<string, ProjectDetailsStore> = {};

  public activeProject?: ProjectStore;

  public setActiveProject(id: string): ProjectStore {
    this.activeProject = (
      this.projects[id] || (
        this.projects[id].project = new ProjectStore(id, 'Unknown')
      )
    );

    return this.activeProject;
  }

  public async getProjects() {
    if (!this.user.user) {
      return;
    }

    const ProjectsQuery = gql`
      query ($id: uuid!) {
        projects(where: {owner_user_id: {_eq: $id}}) {
          id
          image
          title
          created_at
          updated_at
        }
      }
    `;

    const output = await this.user.client
      .query(ProjectsQuery, {
        id: this.user.user.id,
      })
      .toPromise();

    if (!output.data?.projects?.length) {
      return;
    }

    output.data.projects.forEach((project: any) => {
      this.projects[project.id] = new ProjectDetailsStore();
    });
  }
}

registerLoadable({ Store });

export const store = new Store();
