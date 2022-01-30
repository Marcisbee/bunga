import { BehaviorSubject, combineLatest } from 'rxjs';

import { Constructor } from '../../types/constructor';

import { Connection } from './connection';
import { CountEdge } from './data/count.edge';
import { DataEdge } from './data/data.edge';
import { ToggleEdge } from './data/toggle.edge';
import { Edge } from './edge';
import { LogicEdge } from './logic/logic.edge';
import { MathEdge } from './math/math.edge';

export class VariableEdge extends Edge {
  public static title = 'variable';

  public input = {
    name: new BehaviorSubject<string>('value'),
    value: new BehaviorSubject<Connection | null>(null),
  };

  public connectableTo: Record<string, Constructor<Edge>[]> = {
    value: [
      LogicEdge,
      DataEdge,
      MathEdge,
      CountEdge,
      ToggleEdge,
    ],
  };

  public select = {
    default: this.selectInput<unknown>('value'),
    both: combineLatest([
      this.selectInput<unknown>('name'),
      this.selectInput<unknown>('value'),
    ]),
  };
}
