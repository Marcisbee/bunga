import {
  BehaviorSubject,
  distinctUntilChanged,
  mapTo,
  merge,
  mergeMap,
  startWith,
  takeWhile,
} from 'rxjs';

import { Constructor } from '../../../types/constructor';
import { interactiveModeStore } from '../../interactive-mode.store';
import { Connection } from '../connection';
import { Edge } from '../edge';
import { MouseEventEdge } from '../event/event.mouse.edge';

import { BooleanEdge } from './data.boolean.edge';
import { NumberEdge } from './data.number.edge';

export class ToggleEdge extends Edge {
  public static title = 'Toggle';

  public input = {
    initial: new BehaviorSubject<Connection | null>(null),
    on: new BehaviorSubject<Connection | null>(null),
    off: new BehaviorSubject<Connection | null>(null),
  };

  public connectableTo: Record<string, Constructor<Edge>[]> = {
    initial: [
      BooleanEdge,
    ],
    on: [
      MouseEventEdge,
      NumberEdge,
    ],
    off: [
      MouseEventEdge,
      NumberEdge,
    ],
  };

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public select = {
    default: interactiveModeStore.isInteractive$
      .pipe(
        mergeMap((isInteractive) => {
          if (!isInteractive) {
            return this.selectInput('initial')
              .pipe(
                takeWhile(() => !interactiveModeStore.isInteractive$.value),
                startWith(false),
              );
          }

          return (
            merge([
              this.selectInput<boolean>('initial').pipe(startWith(false)),
              this.selectInput<unknown>('on').pipe(mapTo(true)),
              this.selectInput<unknown>('off').pipe(mapTo(false)),
            ])
              .pipe(
                takeWhile(() => interactiveModeStore.isInteractive$.value),
                mergeMap((observable) => observable),
                startWith(false),
              )
          );
        }),
        distinctUntilChanged(),
      ),
  };
}
