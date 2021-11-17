import { Exome, registerLoadable } from 'exome';

import { permalink } from '../utils/permalink';

import { ActiveComponentStore, ComponentPositionStore, ComponentStore } from './component.store';
import { BoundaryStore } from './boundary.store';
import { PositionStore } from './position.store';
import { ActiveElementStore } from './element.store';
import { ActiveStyleStore, StyleStore } from './style.store';
import { ActionPositionStore, ActionStore, ActionStyleStore } from './action.store';

export class SpaceStore extends Exome {
  public position = new PositionStore();
  public boundary = new BoundaryStore(this);
  public activeComponent = new ActiveComponentStore();
  public activeElement = new ActiveElementStore();
  public activeStyle = new ActiveStyleStore();

  constructor(
    public id: string,
    public name: string,
    public path: string = permalink(name),
    public components: ComponentStore[] = [],
    public styles: StyleStore[] = [],
    public actions: ActionStore[] = [],
  ) {
    super();
  }

  public addComponent() {
    this.boundary.updateBoundary();

    let { x, y, width, height } = this.boundary;

    const active = this.activeComponent.active;
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
    if (this.components.length === 0) {
      position.x = -(position.width / 2);
      position.y = -(position.height / 2);
    }

    const component = new ComponentStore(
      Math.random().toString(),
      position,
      'Unnamed component',
    );
    this.components.push(component);
    this.activeComponent.setActive(component);

    this.boundary.updateBoundary();

    return component;
  }

  public addAction() {
    this.boundary.updateBoundary();

    let { x, y, width, height } = this.boundary;

    const active = this.activeComponent.active;
    if (active) {
      x = active.position.x;
      y = active.position.y;
      width = active.position.width;
      height = active.position.height;
    }

    const position = new ActionPositionStore(
      width + x + 20,
      y,
      170,
      120,
    );

    // Center first action in space.
    if (this.actions.length === 0) {
      position.x = -(position.width / 2);
      position.y = -(position.height / 2);
    }

    const action = new ActionStyleStore(position);
    this.actions.push(action);
    // this.activeComponent.setActive(action);

    this.boundary.updateBoundary();

    return action;
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
