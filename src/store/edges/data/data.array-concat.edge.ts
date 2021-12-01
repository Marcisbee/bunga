import { BehaviorSubject, combineLatest, map } from 'rxjs';

import { StyleStore } from '../../style.store';
import { Connection } from '../connection';
import { Edge } from '../edge';
import { StyleEdge } from '../style.edge';

import { ArrayEdge } from './data.array.edge';
import { DataEdge } from './data.edge';

export class ArrayConcatEdge extends DataEdge {
  public static title = '(data) Array.concat';

  public input = {
    array: new BehaviorSubject<Connection | null>(null),
    value: new BehaviorSubject<Connection | null>(null),
  };

  public connectableTo: Record<string, typeof Edge[]> = {
    array: [
      ArrayEdge,
      ArrayConcatEdge,
    ],
    value: [
      StyleEdge,
    ],
  };

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public select = {
    default: combineLatest([
      this.selectInput<any[]>('array'),
      this.selectInput<StyleStore>('value'),
    ]).pipe(
      map(([array, value]) => array.concat(value)),
    ),
  };
}
