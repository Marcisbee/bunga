import { useStore } from 'exome/react';

import { Connection } from './connection';
import { Edge } from './edge';

function RenderValue({ edge }: { edge: BooleanEdge }) {
  const { input, setPrimitiveInput } = useStore(edge);

  return (
    <input
      type="checkbox"
      checked={!input.value}
      onChange={(event) => {
        setPrimitiveInput('value', !event.target.checked);
      }}
      style={{
        fontSize: 11,
        height: 14,
        width: 14,
        padding: 1,
        marginTop: 2,
        verticalAlign: 'middle',
        border: 0,
        borderRadius: 2,
        backgroundColor: '#fff',
        fontWeight: 'bold',
      }}
    />
  );
}

export class BooleanEdge extends Edge {
  public static title = 'Boolean';

  public style = 'variable';

  public input: { value: boolean | undefined } = {
    value: undefined,
  };

  public connectableTo: Record<string, typeof Edge[]> = {};

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public evaluate = async () => ({
    default: !!this.input.value,
  });

  public customControls = {
    value: () => <RenderValue edge={this} />,
  };
}
