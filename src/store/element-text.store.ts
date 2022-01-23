import { Exome, registerLoadable } from 'exome';

import { Connection } from './edges/connection';

export class ElementTextStore extends Exome {
  // public getPosition = () => ({
  //   x: 0,
  //   y: 0,
  //   width: 0,
  //   height: 0,
  // });

  public connection: Connection | null = null;

  constructor(
    // public text: string | StyleProperty,
    public text: string,
  ) {
    super();
  }

  public addConnection(connection: Connection) {
    this.connection = connection;
  }

  public setText(text: string) {
    this.text = text;
  }
}

registerLoadable({ ElementTextStore });
