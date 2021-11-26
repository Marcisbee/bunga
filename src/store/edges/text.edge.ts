import { Edge } from './edge';
import { Connection } from './connection';

export class TextEdge extends Edge {
  public static title = 'Text';
  public style = 'variable';

  public input: { value: string | undefined } = {
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
