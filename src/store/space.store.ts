import { Exome, registerLoadable } from 'exome';

import { permalink } from '../utils/permalink';

import { ComponentPositionStore, ComponentStore } from './component.store';
import { BoundaryStore } from './boundary.store';
import { PositionStore } from './position.store';
import { ActiveElementStore } from './element.store';
import { ActiveStyleStore, StyleStore } from './style.store';
import { Edge } from './edges/edge';
import { EdgePosition } from './edges/position';
import { TokenStore } from './token.store';
import { moveStore } from './move.store';

export class SpaceStore extends Exome {
  public position = new PositionStore();
  public boundary = new BoundaryStore(this);
  public activeElement = new ActiveElementStore();
  public activeStyle = new ActiveStyleStore();

  constructor(
    public id: string,
    public name: string,
    public path: string = permalink(name),
    public components: ComponentStore[] = [],
    public styles: StyleStore[] = [],
    public edges: Edge[] = [],
    public tokens: TokenStore[] = [
      new TokenStore(name),
    ],
  ) {
    super();
  }

  public addComponent() {
    this.boundary.updateBoundary();

    let { x, y, width, height } = this.boundary;

    const active = moveStore.selectedAll[0];
    if (active) {
      x = active.position.x;
      y = active.position.y;
      width = active.position.width;
      height = active.position.height;
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
      'Unnamed component',
    );
    this.components.push(component);
    moveStore.selectComponent(component);

    this.boundary.updateBoundary();

    return component;
  }

  public addEdge(Apply: typeof Edge) {
    this.boundary.updateBoundary();

    let { x, y, width, height } = this.boundary;

    const active = moveStore.selectedAll[0];
    if (active) {
      x = active.position.x;
      y = active.position.y;
      width = active.position.width;
      height = active.position.height;
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

    // @ts-ignore
    const edge: Edge = new Apply(position);
    this.edges.push(edge);
    moveStore.selectEdge(edge);

    this.boundary.updateBoundary();

    return edge;
  }

  public addStyle() {
    const style = new StyleStore('unnamed');

    this.styles.push(style);
    this.activeStyle.setActive(style);
  }

  public rename(name: string, path: string = permalink(name)) {
    this.name = name;
    this.path = path;
  }
}

registerLoadable({ SpaceStore });
