import { Exome, registerLoadable } from 'exome';

import { ElementEdge } from './edges/element.edge';
import { ElementTextStore } from './element-text.store';
import { undoable } from './undo.store';

export class ActiveElementStore extends Exome {
  public active: ElementStore | null = null;

  public setActive(element: ElementStore | null) {
    this.active = element;
  }
}

export class ElementStore<T extends Record<string, any> = Record<string, any>> extends Exome {
  // public getPosition = () => ({
  //   x: 0,
  //   y: 0,
  //   width: 0,
  //   height: 0,
  // });

  constructor(
    public type: string | ElementEdge,
    public props: T = {} as T,
    public children: (ElementStore | ElementTextStore)[] = [],
  ) {
    super();
  }

  // @undoable
  public remove(item: ElementStore | ElementTextStore) {
    const index = this.children.indexOf(item);

    if (index === -1) {
      return;
    }

    this.children.splice(index, 1);
  }

  // @undoable
  public addBefore(
    item: ElementStore | ElementTextStore,
    before?: ElementStore | ElementTextStore,
  ) {
    const index = this.children.indexOf(before!);

    this.children.splice(index, 0, item);

    // So if component is active, set its' new parent in active store
    // if (activeElementStore.active === item) {
    //   activeElementStore.setActive(item, path, this);
    // }
  }

  // @undoable
  // public addAfter(path: string, item: ElementStore, after?: ElementStore) {
  //   const list = dlv(this.props, path);
  //   const index = list.indexOf(after) + 1;

  //   list.splice(index, 0, item);

  //   // So if component is active, set its' new parent in active store
  //   // if (activeElementStore.active === item) {
  //   //   activeElementStore.setActive(item, path, this);
  //   // }
  // }

  // @undoable
  // public updateProps(path: string, value: unknown) {
  //   dset(this.props, path, value);
  // }
}

registerLoadable({ ElementStore });
