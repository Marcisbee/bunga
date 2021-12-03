import { BehaviorSubject, map } from 'rxjs';

import { Connection } from '../connection';
import { Edge } from '../edge';
import { MathEdge } from '../math/math.edge';

import { DataEdge } from './data.edge';
import { NumberEdge } from './data.number.edge';

export class ArrayEdge extends DataEdge {
  public static title = 'Array';

  public input = {
    size: new BehaviorSubject<Connection | null>(null),
  };

  public connectableTo: Record<string, typeof Edge[]> = {
    size: [
      NumberEdge,
      MathEdge,
    ],
  };

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public select = {
    default: this.selectInput<number>('size').pipe(
      map((size = 0) => new Array(size).fill(undefined)),
    ),
  };
}
