import { useStore } from 'exome/react';
import { BehaviorSubject } from 'rxjs';

import { Connection } from '../connection';
import { Edge } from '../edge';

import { DataEdge } from './data.edge';

export class NumberEdge extends DataEdge {
  public static title = '(data) Number';

  public input = {
    value: new BehaviorSubject<number | undefined>(undefined),
  };

  public connectableTo: Record<string, typeof Edge[]> = {};

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public select = {
    default: this.input.value.pipe(),
  };

  public customControls = {
    value: () => <RenderValue edge={this} />,
  };
}

function RenderValue({ edge }: { edge: NumberEdge }) {
  const { input } = useStore(edge);

  return (
    <input
      type="number"
      name="number_value"
      defaultValue={input.value.getValue()}
      onChange={(event) => {
        input.value.next(Number(event.target.value));
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
