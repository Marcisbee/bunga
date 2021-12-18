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

  public projectsDetails: Record<string, ProjectDetailsStore> = {};

  public projects: Record<string, ProjectStore> = {};

  public activeProject?: ProjectStore;

  public async getProjectById(id: string) {
    if (!this.user.user) {
      return;
    }

    const ProjectsQuery = gql`
      query GetProjectById($id: uuid!) {
        projects_by_pk(id: $id) {
          id
          image
          title
          content
          created_at
          updated_at
        }
      }
    `;

    const output = await this.user.client
      .query(ProjectsQuery, { id })
      .toPromise();

    const project = output.data?.projects_by_pk;

    if (!project) {
      throw new Error('Project was not found');
    }

    return this.activeProject = (
      this.projects[id] || (
        this.projects[id] = new ProjectStore(id, project.title)
      )
    );
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
      this.projectsDetails[project.id] = new ProjectDetailsStore(project.title);
    });
  }

  public async createProject(title = 'Untitled') {
    if (!this.user.user) {
      return;
    }

    const ProjectsMutation = gql`
      mutation ($content: jsonb, $title: String) {
        insert_projects_one(object: {content: $content, title: $title}) {
          id
        }
      }
    `;

    const output = await this.user.client
      .mutation(ProjectsMutation, {
        title,
        content: { name: 123 },
      })
      .toPromise();

    const project = output.data?.insert_projects_one;

    if (!project) {
      throw new Error('Project creation failed');
    }

    this.projectsDetails[project.id] = new ProjectDetailsStore(project.title);

    setTimeout(() => {
      this.getProjects();
    }, 200);

    return project.id;
  }
}

registerLoadable({ Store });

export const store = new Store();
