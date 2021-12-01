import {
  BehaviorSubject,
  combineLatest,
  map,
} from 'rxjs';

import { Connection } from '../connection';
import { BooleanEdge } from '../data/data.boolean.edge';
import { NumberEdge } from '../data/data.number.edge';
import { StringEdge } from '../data/data.string.edge';
import { Edge } from '../edge';
import { MathEdge } from '../math/math.edge';

import { LogicGateEdge } from './logic.gate.edge';

export class LogicEqualsEdge extends Edge {
  public static title = 'Logic.equals';

  public input = {
    a: new BehaviorSubject<Connection | null>(null),
    b: new BehaviorSubject<Connection | null>(null),
  };

  public connectableTo: Record<string, typeof Edge[]> = {
    a: [
      LogicGateEdge,
      BooleanEdge,
      NumberEdge,
      MathEdge,
      StringEdge,
    ],
    b: [
      LogicGateEdge,
      BooleanEdge,
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
      map(([a, b]) => a === b),
    ),
  };
}
