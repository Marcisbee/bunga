import { BehaviorSubject, combineLatest, map } from 'rxjs';

import { Constructor } from '../../../types/constructor';
import { StyleStore } from '../../style.store';
import { Connection } from '../connection';
import { Edge } from '../edge';
import { LogicGateEdge } from '../logic/logic.gate.edge';

import { ArrayEdge } from './data.array.edge';
import { DataEdge } from './data.edge';

export class ArrayConcatEdge extends DataEdge {
  public static title = 'Array concat';

  public input = {
    array: new BehaviorSubject<Connection | null>(null),
    value: new BehaviorSubject<Connection | null>(null),
  };

  public connectableTo: Record<string, Constructor<Edge>[]> = {
    array: [
      ArrayEdge,
      ArrayConcatEdge,
    ],
    value: [
      LogicGateEdge,
    ],
  };

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public select = {
    default: combineLatest([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.selectInput<any[]>('array'),
      this.selectInput<StyleStore>('value'),
    ]).pipe(
      map(([array, value]) => (array || []).concat(value)),
    ),
  };
}
