import { Exome, addMiddleware, registerLoadable } from 'exome';
import { exomeDevtools } from 'exome/devtools';

import { SpaceStore } from './space.store';

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
  // @TODO: Create user store.
  public user: any;
  public spaces: Record<string, SpaceStore> = {};
  public activeSpace?: SpaceStore;

  public setActiveSpace(id: string): SpaceStore {
    return this.activeSpace = (
      this.spaces[id] || (
        this.spaces[id] = new SpaceStore(id, 'Unknown')
      )
    );
  }
}

registerLoadable({ Store });

export const store = new Store();
