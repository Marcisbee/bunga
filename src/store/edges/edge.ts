import { Exome } from 'exome';
import React from 'react';
import {
  BehaviorSubject,
  Observable,
  of,
  switchMap,
} from 'rxjs';

import { Constructor } from '../../types/constructor';
import { undoable } from '../undo.store';

import { Connection } from './connection';
import { EdgePosition } from './position';

export class Edge extends Exome {
  public static title: string;

  public style?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public input!: Record<string, BehaviorSubject<null | Connection | any>>;

  public connectableTo!: Record<string, Constructor<Edge>[]>;

  public output!: Record<string, Connection>;

  public select!: Record<string, Observable<unknown>>;

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
      switchMap((connection: Connection | Observable<any>): Observable<T> => {
        if (connection instanceof Observable) {
          return connection;
        }

        if (connection instanceof Connection) {
          return connection.from.select[connection.path] as unknown as Observable<T>;
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

  @undoable<Edge>({
    saveHandler(instance, payload) {
      return instance.input[payload[0]].getValue();
    },
    restoreHandler(instance, payload, savedValue) {
      instance.input[payload[0]].next(savedValue || null);
    },
  })
  public connectInput(to: string, connection: Connection) {
    this.input[to].next(connection);

    this.onInputConnected(to);
  }

  @undoable<Edge>({
    saveHandler(instance, payload) {
      return instance.input[payload[0]].getValue();
    },
    restoreHandler(instance, payload, savedValue) {
      instance.input[payload[0]].next(savedValue || null);
    },
  })
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
