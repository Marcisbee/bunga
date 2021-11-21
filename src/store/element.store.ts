import dlv from 'dlv';
import { dset } from 'dset';
import { Exome, registerLoadable } from 'exome';

import { ElementTextStore } from './element-text.store';
import { undoable } from './undo.store';

export class ActiveElementStore extends Exome {
  public active: ElementStore | null = null;

  public setActive(element: ElementStore | null) {
    this.active = element;
  }
}

export class ElementStore<T extends Record<string, any> = Record<string, any>> extends Exome {
  public getPosition = () => ({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  constructor(
    public type: string,
    public props: T = {} as T,
    public children?: (ElementStore | ElementTextStore)[],
  ) {
    super();
  }

  @undoable
  public remove(path: string, item: ElementStore) {
    const list = dlv(this.props, path);
    const index = list.indexOf(item);

    if (index === -1) {
      return;
    }

    list.splice(index, 1);
  }

  @undoable
  public addBefore(path: string, item: ElementStore, before?: ElementStore) {
    const list = dlv(this.props, path);
    const index = list.indexOf(before);

    list.splice(index, 0, item);

    // So if component is active, set its' new parent in active store
    // if (activeElementStore.active === item) {
    //   activeElementStore.setActive(item, path, this);
    // }
  }

  @undoable
  public addAfter(path: string, item: ElementStore, after?: ElementStore) {
    const list = dlv(this.props, path);
    const index = list.indexOf(after) + 1;

    list.splice(index, 0, item);

    // So if component is active, set its' new parent in active store
    // if (activeElementStore.active === item) {
    //   activeElementStore.setActive(item, path, this);
    // }
  }

  @undoable
  public updateProps(path: string, value: unknown) {
    dset(this.props, path, value);
  }
}

registerLoadable({ ElementStore });
