import { combineLatest, map } from 'rxjs';

import { Connection } from './connection';
import { ArrayEdge } from './data-array.edge';
import { Edge } from './edge';
import { MathEdge } from './math.edge';
import { StyleEdge } from './style.edge';

type ArrayConcatEdgeInput = {
  array: Connection | null;
  value: Connection | null;
}

export class ArrayConcatEdge extends MathEdge {
  public static title = 'Array.concat';

  public input: ArrayConcatEdgeInput = {
    array: null,
    value: null,
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

  public selectOutput = (path: string) => {
    const array = this.selectInput<any[]>('array');
    const value = this.selectInput<any[]>('value');

    if (!array || !value) {
      return undefined as any;
    }

    return combineLatest([
      array,
      value,
    ]).pipe(
      map(([a, b]) => a.concat(b)),
    );
  };
}
