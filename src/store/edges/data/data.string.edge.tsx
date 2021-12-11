import { useStore } from 'exome/react';
import { BehaviorSubject } from 'rxjs';

import { useObservable } from '../../../hooks/use-observable';
import { undoable } from '../../undo.store';
import { Connection } from '../connection';
import { Edge } from '../edge';

import { DataEdge } from './data.edge';

export class StringEdge extends DataEdge {
  public static title = 'String';

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

  @undoable<StringEdge>({
    saveHandler(instance) {
      return instance.input.value.getValue();
    },
    restoreHandler(instance, payload, savedValue) {
      instance.input.value.next(savedValue || null);
    },
  })
  public updateInputValue(value: string) {
    this.input.value.next(value);
  }
}

function RenderValue({ edge }: { edge: StringEdge }) {
  const { input, updateInputValue } = useStore(edge);
  const value = useObservable(input.value);

  return (
    <input
      type="text"
      value={value || ''}
      onInput={(event) => {
        updateInputValue((event.target as HTMLInputElement).value);
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
