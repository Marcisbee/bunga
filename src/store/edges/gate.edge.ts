import { combineLatest, map } from 'rxjs';

import { StyleStore } from '../style.store';

import { BooleanEdge } from './boolean.edge';
import { Connection } from './connection';
import { Edge } from './edge';
import { LogicEqualsEdge } from './logic-equals.edge';
import { StyleEdge } from './style.edge';

type GateEdgeInput = {
  condition: Connection | null,
  style: Connection | null,
}

export class GateEdge extends Edge {
  public static title = 'Gate';

  public style = 'operation';

  public input: GateEdgeInput = {
    condition: null,
    style: null,
  };

  public connectableTo: Record<string, typeof Edge[]> = {
    condition: [BooleanEdge, LogicEqualsEdge],
    style: [StyleEdge],
  };

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public selectOutput = (path: string) => {
    const condition = this.selectInput<boolean>('condition');
    const style = this.selectInput<StyleStore>('style');

    if (!condition || !style) {
      return undefined as any;
    }

    return combineLatest([
      condition,
      style,
    ]).pipe(
      map(([a, b]) => (a ? b : undefined)),
    );
  };
}
