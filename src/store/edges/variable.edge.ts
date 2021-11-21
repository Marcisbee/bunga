import { Edge } from './edge';
import { Connection } from './connection';

export class VariableEdge extends Edge {
  public name = 'Value';
  public style = 'variable';

  public input: { type: 'number' | 'string', value: any } = {
    type: 'number',
    value: undefined,
  };
  public connectableTo: Record<string, typeof Edge[]> = {};

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public evaluate = async () => {
    return {
      default: this.input.value,
    };
  }
}

