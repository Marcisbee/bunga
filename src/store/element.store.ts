import { Exome, registerLoadable } from 'exome';

import { ComponentStore } from './component.store';
import { ElementTextStore } from './element-text.store';
import { ShapeStore } from './shape.store';
// import { undoable } from './undo.store';

export class ActiveElementStore extends Exome {
  public active: ElementStore | null = null;

  public setActive(element: ElementStore | null) {
    this.active = element;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ElementStore<
  T extends Record<string, any> = Record<string, any>,
  TYPE = string | ShapeStore | ComponentStore
> extends Exome {
  // public getPosition = () => ({
  //   x: 0,
  //   y: 0,
  //   width: 0,
  //   height: 0,
  // });

  constructor(
    public type: TYPE,
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
  }

  // @undoable
  public addAfter(
    item: ElementStore | ElementTextStore,
    after?: ElementStore | ElementTextStore,
  ) {
    const index = this.children.indexOf(after!) + 1;

    this.children.splice(index, 0, item);
  }

  // @undoable
  public append(
    item: ElementStore | ElementTextStore,
  ) {
    this.children.push(item);
  }

  // @undoable
  // public updateProps(path: string, value: unknown) {
  //   dset(this.props, path, value);
  // }
}

registerLoadable({ ElementStore });
