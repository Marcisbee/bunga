import { Edge } from './edge';
import { Connection } from './connection';
import { VariableEdge } from './variable.edge';

export class MathAddEdge extends Edge {
  public name = 'Math (+)';
  public style = 'operation';

  public input: { first: Connection | null, second: Connection | null } = {
    first: null,
    second: null,
  };
  public connectableTo: Record<string, typeof Edge[]> = {
    first: [
      VariableEdge,
      MathAddEdge,
    ],
    second: [
      VariableEdge,
      MathAddEdge,
    ],
  };

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public evaluate = async () => {
    const first = this.input.first;
    const second = this.input.second;

    if (!first || !second) {
      return {
        default: undefined,
      };
    }

    const firstValue = await first.from.evaluate();
    const secondValue = await second.from.evaluate();

    return {
      default: firstValue?.[first.path] + secondValue?.[second.path],
    };
  }
}
