import { Exome, registerLoadable } from 'exome';

import { Connection } from './edges/connection';
// import { ElementTextEdge } from './edges/element-text.edge';
// import { EdgePosition } from './edges/position';

export class ElementTextStore extends Exome {
  // public edge = new ElementTextEdge(new EdgePosition('element'));

  public getPosition = () => ({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  public connection: Connection | null = null;

  constructor(
    public text: string,
  ) {
    super();
  }

  public addConnection(connection: Connection) {
    this.connection = connection;
  }
}

registerLoadable({ ElementTextStore });
