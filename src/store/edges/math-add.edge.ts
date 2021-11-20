import { Edge } from './edge';
import { Connection } from './connection';
import { VariableEdge } from './variable.edge';

export class MathAddEdge extends Edge {
  public name = 'Math (+)';
  public style = 'operation';

  public input: { a: Connection | null, b: Connection | null } = {
    a: null,
    b: null,
  };
  public connectableTo: Record<string, typeof Edge[]> = {
    a: [VariableEdge],
    b: [VariableEdge],
  };

  public output: { default: Connection } = {
    default: new Connection(this, []),
  };

  public evaluate = async () => {
    const a = await this.input.a?.from.evaluate();
    const b = await this.input.b?.from.evaluate();

    return {
      default: a.default + b.default,
    };
  }
}
