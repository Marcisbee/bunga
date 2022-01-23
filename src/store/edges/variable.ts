import { BehaviorSubject, combineLatest } from 'rxjs';

import { Constructor } from '../../types/constructor';

import { Connection } from './connection';
import { BooleanEdge } from './data/data.boolean.edge';
import { NumberEdge } from './data/data.number.edge';
import { StringEdge } from './data/data.string.edge';
import { Edge } from './edge';
import { MathEdge } from './math/math.edge';

export class VariableEdge extends Edge {
  public static title = 'variable';

  public input = {
    name: new BehaviorSubject<string>('value'),
    value: new BehaviorSubject<Connection | null>(null),
  };

  public connectableTo: Record<string, Constructor<Edge>[]> = {
    value: [
      BooleanEdge,
      NumberEdge,
      MathEdge,
      StringEdge,
    ],
  };

  public select = {
    default: this.selectInput<unknown>('value'),
    both: combineLatest([
      this.selectInput<unknown>('name'),
      this.selectInput<unknown>('value'),
    ]),
  };
}
