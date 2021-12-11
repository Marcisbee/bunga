import { useStore } from 'exome/react';
import { BehaviorSubject } from 'rxjs';

import { useObservable } from '../../../hooks/use-observable';
import { undoable } from '../../undo.store';
import { Connection } from '../connection';
import { Edge } from '../edge';

import { DataEdge } from './data.edge';

export class NumberEdge extends DataEdge {
  public static title = 'Number';

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

  @undoable<NumberEdge>({
    saveHandler(instance) {
      return instance.input.value.getValue();
    },
    restoreHandler(instance, payload, savedValue) {
      instance.input.value.next(savedValue || null);
    },
  })
  public updateInputValue(value: number) {
    this.input.value.next(value);
  }
}

function RenderValue({ edge }: { edge: NumberEdge }) {
  const { input, updateInputValue } = useStore(edge);
  const value = useObservable(input.value);

  return (
    <input
      type="number"
      value={value || ''}
      onInput={(event) => {
        updateInputValue(Number((event.target as HTMLInputElement).value));
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
