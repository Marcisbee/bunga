import {
  BehaviorSubject,
  map,
} from 'rxjs';

import { Constructor } from '../../../types/constructor';
import { Connection } from '../connection';
import { BooleanEdge } from '../data/data.boolean.edge';
import { NumberEdge } from '../data/data.number.edge';
import { StringEdge } from '../data/data.string.edge';
import { Edge } from '../edge';
import { MathEdge } from '../math/math.edge';

import { LogicEdge } from './logic.edge';

export class LogicNotEdge extends LogicEdge {
  public static title = 'Not';

  public input = {
    value: new BehaviorSubject<Connection | null>(null),
  };

  public connectableTo: Record<string, Constructor<Edge>[]> = {
    value: [
      LogicEdge,
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
    default: this.selectInput<unknown>('value')
      .pipe(
        map((a) => !a),
      ),
  };
}
