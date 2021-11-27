import { Exome } from 'exome';

import { Edge } from './edge';

export class Connection extends Exome {
  constructor(
    public from: Edge,
    public path: string,
    public to: [string, Edge][] = [],
  ) {
    super();
  }

  public disconnect(to: string, edge: Edge) {
    // Disconnect edge to connection
    edge.input[to] = null;
    const index = this.to.findIndex((a) => a[0] === to && a[1] === edge);
    this.to.splice(index, 1);

    return true;
  }

  public connect(to: string, edge: Edge): boolean {
    if (!edge.canConnect(to, this.from)) {
      return false;
    }

    // Connect edge to connection
    edge.input[to] = this;
    this.to.push([to, edge]);

    return true;
  }
}
