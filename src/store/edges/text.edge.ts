import { BehaviorSubject } from 'rxjs';

import { Connection } from './connection';
import { Edge } from './edge';

type TextEdgeInput = {
  value: BehaviorSubject<string>;
}

export class TextEdge extends Edge {
  public static title = 'Text';

  public style = 'variable';

  public input: TextEdgeInput = {
    value: new BehaviorSubject<string>(''),
  };

  public connectableTo: Record<string, typeof Edge[]> = {};

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public selectOutput = (path: string) => this.input.value as any;
}
