import { combineLatest, map } from 'rxjs';

import { BooleanEdge } from './boolean.edge';
import { Connection } from './connection';
import { Edge } from './edge';
import { GateEdge } from './gate.edge';
import { MathEdge } from './math.edge';
import { NumberEdge } from './number.edge';
import { TextEdge } from './text.edge';

type LogicEqualsEdgeInput = {
  a: Connection | null,
  b: Connection | null,
}

export class LogicEqualsEdge extends Edge {
  public static title = 'Logic Equals';

  public style = 'operation';

  public input: LogicEqualsEdgeInput = {
    a: null,
    b: null,
  };

  public connectableTo: Record<string, typeof Edge[]> = {
    a: [
      GateEdge,
      BooleanEdge,
      NumberEdge,
      MathEdge,
      TextEdge,
    ],
    b: [
      GateEdge,
      BooleanEdge,
      NumberEdge,
      MathEdge,
      TextEdge,
    ],
  };

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public selectOutput = (path: string) => {
    const a = this.selectInput<unknown>('a');
    const b = this.selectInput<unknown>('b');

    if (!a || !b) {
      return undefined as any;
    }

    return combineLatest([
      a,
      b,
    ]).pipe(
      map(([first, second]) => (first === second)),
    );
  };
}
