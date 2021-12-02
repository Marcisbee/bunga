import { Exome } from 'exome';
import React from 'react';
import {
  BehaviorSubject,
  mergeMap,
  Observable,
  of,
} from 'rxjs';

import { Connection } from './connection';
import { EdgePosition } from './position';

export abstract class Edge extends Exome {
  public static title: string;

  public style?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public abstract input: Record<string, BehaviorSubject<null | Connection | any>>;

  public abstract connectableTo: Record<string, typeof Edge[]>;

  public abstract output: Record<string, Connection>;

  public abstract select: Record<string, Observable<unknown>>;

  constructor(
    public position: EdgePosition,
  ) {
    super();
  }

  public get title() {
    return (this.constructor as typeof Edge).title;
  }

  public selectInput = <T = unknown>(path: string): Observable<T> => (
    this.input[path].pipe<T>(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mergeMap((connection: Connection | Observable<any>): Observable<T> => {
        if (connection instanceof Observable) {
          return connection;
        }

        if (connection instanceof Connection) {
          return connection.from.select[connection.path] as unknown as Observable<T>;
          // @TODO: Check if this maybe fixes some issues:
          // return of<T>(connection.from.select[connection.path] as unknown as T);
        }

        return of<T>(connection || null);
      }),
    )
  );

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
    this.input[to].next(connection);

    this.onInputConnected(to);
  }

  public disconnectInput(path: string) {
    this.input[path].next(null);

    this.onInputDisconnected(path);
  }

  public disconnectOutput(path: string) {
    this.output[path].disconnect(path, this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onInputConnected = (path: string) => {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onInputDisconnected = (path: string) => {};
}
