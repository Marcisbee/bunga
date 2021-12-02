import { Exome, registerLoadable } from 'exome';

import { Connection } from './edges/connection';
import { ElementTextEdge } from './edges/element/element-text.edge';

export class ElementTextStore extends Exome {
  // public getPosition = () => ({
  //   x: 0,
  //   y: 0,
  //   width: 0,
  //   height: 0,
  // });

  public connection: Connection | null = null;

  constructor(
    public text: string | ElementTextEdge,
  ) {
    super();
  }

  public addConnection(connection: Connection) {
    this.connection = connection;
  }
}

registerLoadable({ ElementTextStore });
