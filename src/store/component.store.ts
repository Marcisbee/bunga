import { Exome, onAction, registerLoadable } from 'exome';

import { permalink } from '../utils/permalink';

import { ElementTextStore } from './element-text.store';
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
  // private getAllElementConnections = (elements: (ElementStore | ElementTextStore)[] = this.elements) => {
  //   const connections: ElementTextStore[] = [];

  //   elements.forEach((element) => {
  //     // if ((element as ElementStore).connections) {
  //     //   connections.push(...(element as ElementStore).connections);
  //     // }

  //     if ((element as ElementTextStore).edge && (element as ElementTextStore).edge.input.text) {
  //       connections.push(element as ElementTextStore);
  //     }

  //     if ((element as ElementStore)?.children?.length) {
  //       connections.push(...this.getAllElementConnections((element as ElementStore).children));
  //     }
  //   });

  //   return connections;
  // }

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
        new ElementTextStore('Hello '),
        new ElementStore('strong', undefined, [
          new ElementTextStore('world2'),
        ]),
      ]),
    ]);

    // onAction(ComponentPositionStore, 'moveTo', (instance) => {
    //   if (instance !== this.position) {
    //     return;
    //   }

    //   this.getAllElementConnections()
    //     .forEach((connection) => {
    //       Promise.resolve().then(() => {
    //         const { x, y, width, height } = connection.getPosition();

    //         connection.edge.position.width = width;
    //         connection.edge.position.height = height;
    //         connection.edge.position.moveTo(x, y);
    //       });
    //     });
    // });
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
