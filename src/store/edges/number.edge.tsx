import { useStore } from 'exome/react';

import { Edge } from './edge';
import { Connection } from './connection';

function RenderValue({ edge }: { edge: NumberEdge }) {
  const { input, setPrimitiveInput } = useStore(edge);

  return (
    <input
      type="number"
      defaultValue={input.value}
      onChange={(event) => {
        setPrimitiveInput('value', parseInt(event.target.value, 10));
      }}
      style={{
        fontSize: 11,
        width: 80,
        padding: 1,
        border: 0,
        borderRadius: 2,
        backgroundColor: '#fff',
        fontWeight: 'bold',
      }}
    />
  );
}

export class NumberEdge extends Edge {
  public static title = 'Number';
  public style = 'variable';

  public input: { value: number | undefined } = {
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

  public customControls = {
    value: () => <RenderValue edge={ this } />,
  };
}
