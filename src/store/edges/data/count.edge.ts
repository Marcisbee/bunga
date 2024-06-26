import {
  BehaviorSubject,
  mergeMap,
  of,
  scan,
  startWith,
  takeWhile,
} from 'rxjs';

import { Constructor } from '../../../types/constructor';
import { interactiveModeStore } from '../../interactive-mode.store';
import { Connection } from '../connection';
import { Edge } from '../edge';
import { MouseEventEdge } from '../event/event.mouse.edge';

import { NumberEdge } from './data.number.edge';

export class CountEdge extends Edge {
  public static title = 'Count';

  public input = {
    default: new BehaviorSubject<Connection | null>(null),
  };

  public connectableTo: Record<string, Constructor<Edge>[]> = {
    default: [
      NumberEdge,
      MouseEventEdge,
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
            return of(0).pipe(
              takeWhile(() => !interactiveModeStore.isInteractive$.value),
            );
          }

          return (
            this.selectInput<unknown>('default')
              .pipe(
                takeWhile(() => interactiveModeStore.isInteractive$.value),
                scan((acc) => acc + 1, 0),
                startWith(0),
              )
          );
        }),
      ),
  };
}
