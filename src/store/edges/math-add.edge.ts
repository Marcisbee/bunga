import { combineLatest, map } from 'rxjs';

import { Connection } from './connection';
import { Edge } from './edge';
import { MathEdge } from './math.edge';
import { NumberEdge } from './number.edge';

type MathAddEdgeInput = {
  first: Connection | null;
  second: Connection | null;
}

export class MathAddEdge extends MathEdge {
  public static title = 'Math (+)';

  public input: MathAddEdgeInput = {
    first: null,
    second: null,
  };

  public connectableTo: Record<string, typeof Edge[]> = {
    first: [
      NumberEdge,
      MathEdge,
    ],
    second: [
      NumberEdge,
      MathEdge,
    ],
  };

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public selectOutput = (path: string) => {
    const { first, second } = this.input;

    if (!first || !second) {
      return undefined as any;
    }

    return combineLatest([
      first.from.selectOutput<number>(first.path),
      second.from.selectOutput<number>(second.path),
    ]).pipe(
      map(([a, b]) => a + b),
    );
  };
}
