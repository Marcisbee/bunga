import { Exome, onAction, registerLoadable } from 'exome';

import { permalink } from '../utils/permalink';
import { ActionConnectionStore } from './action.store';

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
  private getAllElementConnections = (elements: ElementStore[] = this.elements) => {
    const connections: ActionConnectionStore[] = [];

    elements.forEach((element) => {
      connections.push(...element.connections);

      if (element.children?.length) {
        connections.push(...this.getAllElementConnections(element.children));
      }
    });

    return connections;
  }

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

    onAction(ComponentPositionStore, 'moveTo', (instance) => {
      if (instance !== this.position) {
        return;
      }

      this.getAllElementConnections()
        .forEach((connection) => {
          connection.reflow();
        });
    });
  }

  public rename(name: string, path: string = permalink(name)) {
    this.name = name;
    this.path = path;
  }

  public addElement(element: ElementStore) {
    this.elements.push(element);
  }
}

registerLoadable({ ComponentStore, ActiveComponentStore });
