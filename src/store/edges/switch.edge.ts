import { combineLatest, map } from 'rxjs';

import { StyleStore } from '../style.store';

import { BooleanEdge } from './boolean.edge';
import { Connection } from './connection';
import { Edge } from './edge';
import { StyleEdge } from './style.edge';

type SwitchEdgeInput = {
  condition: Connection | null,
  style1: Connection | null,
  style2: Connection | null,
}

export class SwitchEdge extends Edge {
  public static title = 'Switch';

  public style = 'operation';

  public input: SwitchEdgeInput = {
    condition: null,
    style1: null,
    style2: null,
  };

  public connectableTo: Record<string, typeof Edge[]> = {
    condition: [BooleanEdge],
    style1: [StyleEdge],
    style2: [StyleEdge],
  };

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public selectOutput = (path: string) => {
    const condition = this.selectInput<boolean>('condition');
    const style1 = this.selectInput<StyleStore>('style1');
    const style2 = this.selectInput<StyleStore>('style2');

    if (!condition || !style1 || !style2) {
      return undefined as any;
    }

    return combineLatest([
      condition,
      style1,
      style2,
    ]).pipe(
      map(([a, b, c]) => (a ? b : c)),
    );
  };
}
