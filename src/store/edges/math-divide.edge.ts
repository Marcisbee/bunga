import { Edge } from './edge';
import { Connection } from './connection';
import { NumberEdge } from './number.edge';
import { MathEdge } from './math.edge';

export class MathDivideEdge extends MathEdge {
  public static title = 'Math (÷)';

  public input: { first: Connection | null, second: Connection | null } = {
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
      default: firstValue?.[first.path] / secondValue?.[second.path],
    };
  }
}
