import { Exome, addMiddleware, registerLoadable } from 'exome';
import { exomeDevtools } from 'exome/devtools';

import { GetProjectByIdDocument, GetProjectsByUserDocument, InsertProjectDocument } from '../graphql';

import { ProjectDetailsStore, ProjectStore } from './project.store';
import { UserStore } from './user.store';

// Enable devtools in dev mode
if (process.env.NODE_ENV !== 'production') {
  addMiddleware(
    exomeDevtools({
      name: 'Bunga app',
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

    const output = await this.user.client
      .query(GetProjectByIdDocument, { id })
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

    const output = await this.user.client
      .query(GetProjectsByUserDocument, {
        id: this.user.user.id,
      })
      .toPromise();

    if (!output.data?.projects?.length) {
      return;
    }

    output.data.projects.forEach((project) => {
      this.projectsDetails[project.id] = new ProjectDetailsStore(project.title);
    });
  }

  public async createProject(title = 'Untitled') {
    if (!this.user.user) {
      return;
    }

    const output = await this.user.client
      .mutation(InsertProjectDocument, {
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
