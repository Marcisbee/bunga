import { Exome, onAction, registerLoadable } from 'exome';

import { permalink } from '../utils/permalink';

import { ElementTextStore } from './element-text.store';
import { ElementStore } from './element.store';

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
}

export class ComponentStore extends Exome {
  // private getAllElementConnections
  //   = (elements: (ElementStore | ElementTextStore)[] = this.elements) => {
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

registerLoadable({ ComponentStore });
