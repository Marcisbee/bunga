import { Exome } from 'exome';

import { Connection } from './connection';
import { EdgePosition } from './position';

export abstract class Edge extends Exome {
  public abstract name: string;
  public style: string = 'operation';
  public abstract input: Record<string, any>;
  public abstract connectableTo: Record<string, typeof Edge[]>;
  public abstract output: Record<string, Connection>;

  constructor(
    public position: EdgePosition,
  ) {
    super();
  }

  public abstract evaluate(): Promise<any>

  public canConnect(to: string, value: any): boolean {
    const instances = this.connectableTo?.[to];

    if (!instances || !Array.isArray(instances)) {
      return false;
    }

    return instances.some((instance) => value instanceof instance);
  }
}
