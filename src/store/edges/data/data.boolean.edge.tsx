import { useStore } from 'exome/react';
import { BehaviorSubject } from 'rxjs';

import { useObservable } from '../../../hooks/use-observable';
import { undoable } from '../../undo.store';
import { Connection } from '../connection';
import { Edge } from '../edge';

import { DataEdge } from './data.edge';

export class BooleanEdge extends DataEdge {
  public static title = 'Boolean';

  public input = {
    value: new BehaviorSubject<boolean | undefined>(false),
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

  @undoable<BooleanEdge>({
    saveHandler(instance) {
      return instance.input.value.getValue();
    },
    restoreHandler(instance, payload, savedValue) {
      instance.input.value.next(savedValue || null);
    },
  })
  public updateInputValue(value: boolean) {
    this.input.value.next(value);
  }
}

function RenderValue({ edge }: { edge: BooleanEdge }) {
  const { input, updateInputValue } = useStore(edge);

  const value = !!useObservable(input.value);

  return (
    <input
      type="checkbox"
      checked={value}
      onChange={(event) => {
        updateInputValue(event.target.checked);
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
