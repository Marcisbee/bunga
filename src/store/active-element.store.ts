import { Exome, registerLoadable } from 'exome';

import { ElementStore } from './element.store';

export class ActiveElementStore extends Exome {
  public path: string | null = null;
  public active: ElementStore | null = null;
  public parent: ElementStore | null = null;

  public setActive(
    active: ElementStore | null,
    path?: string,
    parent?: ElementStore,
  ) {
    this.active = active;

    if (!parent || !path || active === null) {
      this.path = null;
      this.parent = null;
      return;
    }

    this.path = path;
    this.parent = parent;
  }
}

registerLoadable({ ActiveElementStore });

export const activeElementStore = new ActiveElementStore();
