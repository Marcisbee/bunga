import { Exome, registerLoadable } from 'exome';

import { permalink } from '../utils/permalink';

import { ElementStore } from './element.store';

export class ActiveComponentStore extends Exome {
  public active: ComponentStore | null = null;

  public setActive(component: ComponentStore | null) {
    this.active = component;
  }
}

export class ComponentPositionStore extends Exome {
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
    public elements: ElementStore[] = [],
  ) {
    super();

    this.elements.push(...[
      new ElementStore('button', {
        type: 'button',
        style: {
          margin: 10,
        },
      }, [
        new ElementStore('span', {
          dangerouslySetInnerHTML: {
            __html: 'Hello ',
          },
        }),
        new ElementStore('strong', {
          dangerouslySetInnerHTML: {
            __html: 'world',
          },
        }),
      ]),
    ]);
  }

  public rename(name: string, path: string = permalink(name)) {
    this.name = name;
    this.path = path;
  }
}

registerLoadable({ ComponentStore, ActiveComponentStore });