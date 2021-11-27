import { Exome, registerLoadable } from 'exome';

import { permalink } from '../utils/permalink';

import { ElementTextEdge } from './edges/element-text.edge';
import { ElementEdge } from './edges/element.edge';
import { SpaceStore } from './space.store';
import { ActiveStyleStore, StyleStore } from './style.store';
import { TokenStore } from './token.store';

export class ProjectStore extends Exome {
  public activeSpace!: SpaceStore;
  public activeStyle = new ActiveStyleStore();
  public customBlockElements: ElementEdge[] = [];
  public customTextElements: ElementTextEdge[] = [];

  constructor(
    public id: string,
    public name: string,
    public path: string = permalink(name),
    public spaces: SpaceStore[] = [
      new SpaceStore('Space 1'),
    ],
    public styles: StyleStore[] = [],
    public tokens: TokenStore[] = [
      new TokenStore(`${name} Tokens`),
    ],
  ) {
    super();

    this.activeSpace = this.spaces[0];
  }

  public setActiveSpace(space: SpaceStore): SpaceStore {
    return this.activeSpace = space;
  }

  public addSpace(name: string = 'Space ' + (this.spaces.length + 1)) {
    const space = new SpaceStore(name);

    this.spaces.push(space);
    this.activeSpace = space;
  }

  public addStyle() {
    const style = new StyleStore('Style ' + (this.styles.length + 1));

    this.styles.push(style);
    this.activeStyle.setActive(style);
  }

  public rename(name: string, path: string = permalink(name)) {
    this.name = name;
    this.path = path;
  }
}

registerLoadable({ ProjectStore });
