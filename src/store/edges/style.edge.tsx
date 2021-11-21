import { useStore } from 'exome/react';

import { StyleStore } from '../style.store';
import { store } from '../store';

import { Edge } from './edge';
import { Connection } from './connection';
import { getExomeId } from 'exome';

function RenderSource({ edge }: { edge: StyleEdge }) {
  const { input, setPrimitiveInput } = useStore(edge);
  const { styles: stylesList } = useStore(store.activeSpace!);

  return (
    <select
      value={input.source ? getExomeId(input.source) : ''}
      onChange={(e) => {
        const selectedStyle = stylesList.find((s) => getExomeId(s) === e.target.value)!;

        setPrimitiveInput('source', selectedStyle);
      }}
      style={{
        border: 0,
        borderRadius: 3,
        fontSize: 12,
      }}
    >
      <option value="" disabled>Choose style</option>
      {/* @TODO: Separate all options into separate components that listen each style changes. */}
      {stylesList.map((style) => (
        <option value={getExomeId(style)}>{style.name}</option>
      ))}
    </select>
  );
}

export class StyleEdge extends Edge {
  public name = 'Style';
  public style = 'style';

  public input: { source: StyleStore | null } = {
    source: null,
  };
  public connectableTo: Record<string, typeof Edge[]> = {};

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public evaluate = async () => {
    return {
      default: this.input.source,
    };
  }

  public customControls = {
    source: () => <RenderSource edge={this} />,
  };
}

