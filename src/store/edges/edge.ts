import { Exome } from 'exome';
import { nanoid } from 'nanoid';
import { nestie } from 'nestie';
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
import style from './edge.module.scss';
import { EdgePosition } from './position';

export const EdgeStyles: Record<string, Record<'color' | 'hr' | 'bg', string>> = nestie(style, '-');

export class Edge extends Exome {
  public static type: string;

  public static title: string;

  public static style?: keyof typeof EdgeStyles;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public input!: Record<string, BehaviorSubject<null | Connection | any>>;

  public connectableTo!: Record<string, Constructor<Edge>[]>;

  public output!: Record<string, Connection>;

  public select!: Record<string, Observable<unknown>>;

  constructor(
    public position: EdgePosition,
    public id: string = nanoid(20),
  ) {
    super();
  }

  public get type() {
    return (this.constructor as typeof Edge).type;
  }

  public get title() {
    return (this.constructor as typeof Edge).title;
  }

  public get style() {
    return (this.constructor as typeof Edge).style;
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
