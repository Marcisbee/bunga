import { Connection } from './connection';
import { Edge } from './edge';
import { MathEdge } from './math.edge';
import { NumberEdge } from './number.edge';

export class MathSubtractEdge extends MathEdge {
  public static title = 'Math (-)';

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
    const { first } = this.input;
    const { second } = this.input;

    if (!first || !second) {
      return {
        default: undefined,
      };
    }

    const firstValue = await first.from.evaluate();
    const secondValue = await second.from.evaluate();

    return {
      // eslint-disable-next-line no-unsafe-optional-chaining
      default: firstValue?.[first.path] - secondValue?.[second.path],
    };
  };
}
