import { useStore } from 'exome/react';
import { BehaviorSubject } from 'rxjs';

import { Connection } from '../connection';
import { Edge } from '../edge';

import { DataEdge } from './data.edge';

export class StringEdge extends DataEdge {
  public static title = '(data) String';

  public input = {
    value: new BehaviorSubject<string | undefined>(undefined),
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

function RenderValue({ edge }: { edge: StringEdge }) {
  const { input } = useStore(edge);

  return (
    <input
      type="text"
      defaultValue={input.value.getValue()}
      onChange={(event) => {
        input.value.next(event.target.value);
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
