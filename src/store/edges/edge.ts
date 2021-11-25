import { Exome } from 'exome';
import React from 'react';

import { Connection } from './connection';
import { EdgePosition } from './position';

export abstract class Edge extends Exome {
  public static title: string;
  public style?: string;
  public abstract input: Record<string, any>;
  public abstract connectableTo: Record<string, typeof Edge[]>;
  public abstract output: Record<string, Connection>;

  constructor(
    public position: EdgePosition,
  ) {
    super();
  }

  public get title() {
    return (this.constructor as typeof Edge).title;
  }

  public abstract evaluate(): Promise<any>

  public setPrimitiveInput(path: string, value: any) {
    this.input[path] = value;

    for (const key in this.output) {
      if (Object.prototype.hasOwnProperty.call(this.output, key)) {
        const connection = this.output[key];

        connection.recalculate();
      }
    }
  }

  public canConnect(to: string, value: any): boolean {
    const instances = this.connectableTo?.[to];

    if (!instances || !Array.isArray(instances)) {
      return false;
    }

    return instances.some((instance) => value instanceof instance);
  }

  public customControls?: Record<string, React.FunctionComponent>;

  public render?: React.FunctionComponent;

  public recalculate() {}
}
