import {
  BehaviorSubject,
  combineLatest,
  map,
} from 'rxjs';

import { Connection } from '../connection';
import { NumberEdge } from '../data/data.number.edge';
import { Edge } from '../edge';

import { MathEdge } from './math.edge';

export class MathDivideEdge extends MathEdge {
  public static title = 'Math.divide';

  public input = {
    a: new BehaviorSubject<Connection | null>(null),
    b: new BehaviorSubject<Connection | null>(null),
  };

  public connectableTo: Record<string, typeof Edge[]> = {
    a: [
      NumberEdge,
      MathEdge,
    ],
    b: [
      NumberEdge,
      MathEdge,
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
      map(([a, b]) => a / b),
    ),
  };
}
