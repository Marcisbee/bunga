import { Exome, registerLoadable } from 'exome';

import { permalink } from '../utils/permalink';

import { ElementStore } from './element.store';
import { StyleStore } from './style.store';
import { undoable } from './undo.store';

export class ShapePositionSilentStore extends Exome {
  public x = 0;

  public y = 0;

  constructor(
    public parent: ShapePositionStore,
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

export class ShapePositionStore extends Exome {
  public readonly silent = new ShapePositionSilentStore(this);

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

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

export class ShapeStore extends Exome {
  constructor(
    public id: string,
    public position: ShapePositionStore,
    public name: string,
    public style: StyleStore,
    public path: string = permalink(name),
    public root = new ElementStore('root'),
  ) {
    super();
  }

  @undoable({
    dependencies: ['name', 'path'],
  })
  public rename(name: string, path: string = permalink(name)) {
    this.name = name;
    this.path = path;
  }
}

registerLoadable({ ShapeStore });
