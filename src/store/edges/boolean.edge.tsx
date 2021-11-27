import { useStore } from 'exome/react';
import { BehaviorSubject } from 'rxjs';

import { Connection } from './connection';
import { Edge } from './edge';

function RenderValue({ edge }: { edge: BooleanEdge }) {
  const { input } = useStore(edge);

  return (
    <input
      type="checkbox"
      defaultChecked={!!input.value.value}
      onChange={(event) => {
        input.value.next(!event.target.checked);
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

type BooleanEdgeInput = {
  value: BehaviorSubject<boolean>;
}

export class BooleanEdge extends Edge {
  public static title = 'Boolean';

  public style = 'variable';

  public input: BooleanEdgeInput = {
    value: new BehaviorSubject<boolean>(false),
  };

  public connectableTo: Record<string, typeof Edge[]> = {};

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public selectOutput = (path: string) => this.input.value as any;

  public customControls = {
    value: () => <RenderValue edge={this} />,
  };
}
