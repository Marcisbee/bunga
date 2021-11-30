import { Exome } from 'exome';
import React from 'react';
import { BehaviorSubject, Observable } from 'rxjs';

import { Connection } from './connection';
import { EdgePosition } from './position';

export abstract class Edge extends Exome {
  public static title: string;

  public style?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public abstract input: Record<string, null | Connection | BehaviorSubject<any>>;

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

  public abstract selectOutput<T = unknown>(path: string): Observable<T>;

  public selectInput = <T = unknown>(path: string): Observable<T> | undefined => {
    const inputValue = this.input[path];

    if (inputValue instanceof Connection) {
      return inputValue.from?.selectOutput(inputValue.path);
    }

    if (inputValue instanceof BehaviorSubject) {
      return inputValue;
    }

    return undefined;
  };

  public canConnect = (to: string, value: unknown): boolean => {
    const instances = this.connectableTo?.[to];

    if (!instances || !Array.isArray(instances)) {
      return false;
    }

    return instances.some((instance) => value instanceof instance);
  };

  public customControls?: Record<string, React.FunctionComponent>;

  public render?: React.FunctionComponent;

  public connectInput(to: string, connection: Connection) {
    this.input[to] = connection;

    this.onInputConnected(to);
  }

  public disconnectInput(path: string) {
    this.input[path] = null;

    this.onInputDisconnected(path);
  }

  public disconnectOutput(path: string) {
    this.output[path].disconnect(path, this);
  }

  protected onInputConnected = (path: string) => {};

  protected onInputDisconnected = (path: string) => {};
}
