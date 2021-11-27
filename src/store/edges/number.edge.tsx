import { useStore } from 'exome/react';
import { BehaviorSubject } from 'rxjs';

import { Connection } from './connection';
import { Edge } from './edge';

function RenderValue({ edge }: { edge: NumberEdge }) {
  const { input } = useStore(edge);

  return (
    <input
      type="number"
      defaultValue={input.value.value}
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

type NumberEdgeInput = {
  value: BehaviorSubject<number | undefined>;
}

export class NumberEdge extends Edge {
  public static title = 'Number';

  public style = 'variable';

  public input: NumberEdgeInput = {
    value: new BehaviorSubject<number | undefined>(undefined),
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
