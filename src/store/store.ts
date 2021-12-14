import { Exome, addMiddleware, registerLoadable } from 'exome';
import { exomeDevtools } from 'exome/devtools';

import { ProjectStore } from './project.store';
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

  public projects: Record<string, ProjectStore> = {};

  public activeProject?: ProjectStore;

  public setActiveProject(id: string): ProjectStore {
    this.activeProject = (
      this.projects[id] || (
        this.projects[id] = new ProjectStore(id, 'Unknown')
      )
    );

    return this.activeProject;
  }
}

registerLoadable({ Store });

export const store = new Store();
