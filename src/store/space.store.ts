import { Exome, registerLoadable } from 'exome';

import { permalink } from '../utils/permalink';

import { BoundaryStore } from './boundary.store';
import { ComponentPositionStore, ComponentStore } from './component.store';
import { Connection } from './edges/connection';
import { Edge } from './edges/edge';
import { EdgePosition } from './edges/position';
import { ActiveElementStore } from './element.store';
import { MoveStore } from './move.store';
import { PositionStore } from './position.store';

export class SpaceStore extends Exome {
  public move = new MoveStore();

  public position = new PositionStore();

  public boundary = new BoundaryStore(this);

  public activeElement = new ActiveElementStore();

  constructor(
    public name: string,
    public path: string = permalink(name),
    public components: ComponentStore[] = [],
    public edges: Edge[] = [],
  ) {
    super();
  }

  public addComponent() {
    this.boundary.updateBoundary();

    let {
      x,
      y,
      width,
      // height,
    } = this.boundary;

    const active = this.move.selectedAll[0];
    if (active) {
      x = active.position.x;
      y = active.position.y;
      width = active.position.width;
      // height = active.position.height;
    }

    const position = new ComponentPositionStore(
      width + x + 20,
      y,
      270,
      200,
    );

    // Center first component in space.
    if (this.components.length === 0 && this.edges.length === 0) {
      position.x = -(position.width / 2);
      position.y = -(position.height / 2);
    }

    const component = new ComponentStore(
      Math.random().toString(),
      position,
      `Component ${this.components.length + 1}`,
    );
    this.components.push(component);
    this.move.selectComponent(component);

    this.boundary.updateBoundary();

    return component;
  }

  public addEdge<T extends Edge>(Apply: new (...args: any[]) => T): T {
    this.boundary.updateBoundary();

    let {
      x,
      y,
      width,
      // height,
    } = this.boundary;

    const active = this.move.selectedAll[0];
    if (active) {
      x = active.position.x;
      y = active.position.y;
      width = active.position.width;
      // height = active.position.height;
    }

    const position = new EdgePosition(
      'edge',
      width + x + 20,
      y,
      170,
      80,
    );

    // Center first action in space.
    if (this.components.length === 0 && this.edges.length === 0) {
      position.x = -(position.width / 2);
      position.y = -(position.height / 2);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const edge: Edge = new Apply(position);
    this.edges.push(edge);
    this.move.selectEdge(edge);

    this.boundary.updateBoundary();

    return edge as unknown as T;
  }

  public removeComponent(component: ComponentStore) {
    this.components.splice(this.components.indexOf(component), 1);
  }

  public removeEdge(edge: Edge) {
    this.edges.splice(this.edges.indexOf(edge), 1);

    for (const key in edge.output) {
      if (Object.prototype.hasOwnProperty.call(edge.output, key)) {
        const connection = edge.output[key];

        if (connection instanceof Connection) {
          connection.disconnectAll();
        }
      }
    }

    for (const key in edge.input) {
      if (Object.prototype.hasOwnProperty.call(edge.input, key)) {
        const connection = edge.input[key].getValue();

        if (connection instanceof Connection) {
          connection.disconnect(key, edge);
        }
      }
    }
  }

  public rename(name: string, path: string = permalink(name)) {
    this.name = name;
    this.path = path;
  }
}

registerLoadable({ SpaceStore });
