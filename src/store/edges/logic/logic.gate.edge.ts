import {
  BehaviorSubject,
  combineLatest,
  map,
} from 'rxjs';

import { Constructor } from '../../../types/constructor';
import { StyleStore } from '../../style.store';
import { Connection } from '../connection';
import { BooleanEdge } from '../data/data.boolean.edge';
import { ToggleEdge } from '../data/toggle.edge';
import { Edge } from '../edge';

import { LogicEqualsEdge } from './logic.equals.edge';

export class LogicGateEdge extends Edge {
  public static title = 'Gate';

  public input = {
    condition: new BehaviorSubject<Connection | null>(null),
    style: new BehaviorSubject<Connection | null>(null),
  };

  public connectableTo: Record<string, Constructor<Edge>[]> = {
    condition: [
      BooleanEdge,
      ToggleEdge,
      LogicEqualsEdge,
    ],
    style: [

    ],
  };

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public select = {
    default: combineLatest([
      this.selectInput<boolean>('condition'),
      this.selectInput<StyleStore>('style'),
    ]).pipe(
      map(([a, b]) => (a ? b : undefined)),
    ),
  };
}
