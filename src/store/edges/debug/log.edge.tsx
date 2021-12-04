import { useStore } from 'exome/react';
import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';

import { Connection } from '../connection';
import { CountEdge } from '../data/count.edge';
import { NumberEdge } from '../data/data.number.edge';
import { StringEdge } from '../data/data.string.edge';
import { Edge } from '../edge';
import { EventEdge } from '../event.edge';

export class DebugLogEdge extends Edge {
  public static title = 'Debug.log';

  public input = {
    input: new BehaviorSubject<Connection | null>(null),
  };

  public connectableTo: Record<string, typeof Edge[]> = {
    input: [
      NumberEdge,
      StringEdge,
      EventEdge,
      CountEdge,
    ],
  };

  public output = {};

  public select = {
    default: this.selectInput<unknown>('input').pipe(),
  };

  public render = () => <Render edge={this} />;
}

function Render({ edge }: { edge: DebugLogEdge }) {
  const { select } = useStore(edge);
  const [state, setState] = useState<unknown>(null);

  useEffect(() => {
    const subscription = select.default
      .subscribe((data) => {
        // eslint-disable-next-line no-console
        console.log(data);
        setState(data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [select]);

  try {
    return String(state) as unknown as React.ReactElement;
  } catch (e) {
    return 'Can\'t show data' as unknown as React.ReactElement;
  }
}
