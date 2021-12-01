import { map, of } from 'rxjs';

import { Connection } from './connection';
import { Edge } from './edge';
import { NumberEdge } from './number.edge';

type ArrayEdgeInput = {
  size: Connection | null,
}

export class ArrayEdge extends Edge {
  public static title = 'Array';

  public style = 'variable';

  public input: ArrayEdgeInput = {
    size: null,
  };

  public connectableTo: Record<string, typeof Edge[]> = {
    size: [
      NumberEdge,
    ],
  };

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public selectOutput = (path: string) => {
    const size = this.selectInput<number>('size');

    if (!size) {
      return of([]);
    }

    return size.pipe(
      map((arraySize) => new Array(arraySize).fill(undefined)),
    );
  };
}
