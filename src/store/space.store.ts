import { Exome, registerLoadable } from 'exome';

import { permalink } from '../utils/permalink';

import { ActiveComponentStore, ComponentStore } from './component.store';
import { PositionStore } from './position.store';

export class SpaceStore extends Exome {
  public position = new PositionStore();
  public activeComponent = new ActiveComponentStore();

  constructor(
    public id: string,
    public name: string,
    public path: string = permalink(name),
    public components: ComponentStore[] = [],
  ) {
    super();
  }

  public addComponent() {
    const component = new ComponentStore(Math.random().toString(), 'Unnamed component');
    this.components.push(component);

    return component;
  }

  public rename(name: string, path: string = permalink(name)) {
    this.name = name;
    this.path = path;
  }
}

registerLoadable({ SpaceStore });
