import { Exome } from 'exome';

import { undoable } from '../undo.store';

import { Edge } from './edge';

export class Connection extends Exome {
  constructor(
    public from: Edge,
    public path: string,
    public to: [string, Edge][] = [],
  ) {
    super();
  }

  @undoable()
  public disconnect(to: string, edge: Edge) {
    // Disconnect edge to connection
    edge.disconnectInput(to);
    const index = this.to.findIndex((a) => a[0] === to && a[1] === edge);
    this.to.splice(index, 1);

    return true;
  }

  @undoable()
  public connect(to: string, edge: Edge): boolean {
    if (!edge.canConnect(to, this.from)) {
      return false;
    }

    // Connect edge to connection
    edge.connectInput(to, this);
    this.to.push([to, edge]);

    return true;
  }

  @undoable()
  public disconnectAll() {
    this.to.forEach((to) => {
      to[1].disconnectInput(to[0]);
    });
    this.to = [];
  }
}
