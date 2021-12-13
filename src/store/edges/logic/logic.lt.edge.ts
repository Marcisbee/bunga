import {
  BehaviorSubject,
  combineLatest,
  map,
} from 'rxjs';

import { Constructor } from '../../../types/constructor';
import { Connection } from '../connection';
import { NumberEdge } from '../data/data.number.edge';
import { StringEdge } from '../data/data.string.edge';
import { Edge } from '../edge';
import { MathEdge } from '../math/math.edge';

export class LogicLessThanEdge extends Edge {
  public static title = 'Less than';

  public input = {
    a: new BehaviorSubject<Connection | null>(null),
    b: new BehaviorSubject<Connection | null>(null),
  };

  public connectableTo: Record<string, Constructor<Edge>[]> = {
    a: [
      NumberEdge,
      MathEdge,
      StringEdge,
    ],
    b: [
      NumberEdge,
      MathEdge,
      StringEdge,
    ],
  };

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public select = {
    default: combineLatest([
      this.selectInput<number>('a'),
      this.selectInput<number>('b'),
    ]).pipe(
      map(([a, b]) => a < b),
    ),
  };
}
