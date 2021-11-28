import { Exome, registerLoadable } from 'exome';

import { permalink } from '../utils/permalink';

import { ElementTextStore } from './element-text.store';
import { ElementStore } from './element.store';

export class ComponentPositionSilentStore extends Exome {
  public x = 0;

  public y = 0;

  constructor(
    public parent: ComponentPositionStore,
  ) {
    super();
  }

  public moveTo(x: number, y: number) {
    this.x = x;
    this.parent.x = x;
    this.y = y;
    this.parent.y = y;
  }
}

export class ComponentPositionStore extends Exome {
  public readonly silent = new ComponentPositionSilentStore(this);

  constructor(
    public x = 0,
    public y = 0,
    public width = 0,
    public height = 0,
  ) {
    super();
  }

  public moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class ComponentStore extends Exome {
  constructor(
    public id: string,
    public position: ComponentPositionStore,
    public name: string,
    public path: string = permalink(name),
    public elements: (ElementStore | ElementTextStore)[] = [],
  ) {
    super();
  }

  public rename(name: string, path: string = permalink(name)) {
    this.name = name;
    this.path = path;
  }

  public addElement(element: ElementStore | ElementTextStore) {
    this.elements.push(element);
  }
}

registerLoadable({ ComponentStore });
