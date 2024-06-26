import {
  BehaviorSubject,
  combineLatest,
  map,
} from 'rxjs';

import { Constructor } from '../../../types/constructor';
import { Connection } from '../connection';
import { CountEdge } from '../data/count.edge';
import { NumberEdge } from '../data/data.number.edge';
import { Edge } from '../edge';

import { MathEdge } from './math.edge';

export class MathMultiplyEdge extends MathEdge {
  public static title = 'Math.multiply';

  public input = {
    a: new BehaviorSubject<Connection | null>(null),
    b: new BehaviorSubject<Connection | null>(null),
  };

  public connectableTo: Record<string, Constructor<Edge>[]> = {
    a: [
      NumberEdge,
      MathEdge,
      CountEdge,
    ],
    b: [
      NumberEdge,
      MathEdge,
      CountEdge,
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
      map(([a, b]) => a * b),
    ),
  };
}
