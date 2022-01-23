import { Exome, registerLoadable } from 'exome';

import { observableToPromise } from '../utils/observable-to-promise';
import { permalink } from '../utils/permalink';

import { Connection } from './edges/connection';
import { VariableEdge } from './edges/variable';
import { ElementStore } from './element.store';
import { undoable } from './undo.store';

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

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

export class ComponentStore extends Exome {
  public variables: VariableEdge[] = [];

  constructor(
    public id: string,
    public position: ComponentPositionStore,
    public name: string,
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

  @undoable({
    dependencies: ['variables'],
    batchOnly: true,
  })
  public addVariable(edge: VariableEdge) {
    // Must create a new variable reference to make React happy
    this.variables = this.variables.concat(edge);
  }

  @undoable({
    dependencies: ['variables'],
    batchOnly: true,
  })
  public async removeVariable(edge: VariableEdge) {
    const index = this.variables.indexOf(edge);
    this.variables.splice(index, 1);

    const connection = await observableToPromise<Connection>(edge.input.value as never);
    connection.disconnect('value', edge);

    // Must create a new variable reference to make React happy
    this.variables = [...this.variables];
  }
}

registerLoadable({ ComponentStore });
