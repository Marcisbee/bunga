import { getExomeId } from 'exome';
import { useStore } from 'exome/react';

import { store } from '../store';
import { StyleStore } from '../style.store';

import { Connection } from './connection';
import { Edge } from './edge';

function RenderSourceOption({ style }: { style: StyleStore }) {
  const { name } = useStore(style);

  return (
    <option value={getExomeId(style)}>{name}</option>
  );
}

function RenderSource({ edge }: { edge: StyleEdge }) {
  const { input, setPrimitiveInput } = useStore(edge);
  const { styles: stylesList } = useStore(store.activeProject!);

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
      {stylesList.map((style) => (
        <RenderSourceOption
          key={`style-e-option-${getExomeId(style)}`}
          style={style}
        />
      ))}
    </select>
  );
}

export class StyleEdge extends Edge {
  public static title = 'Style';

  public style = 'style';

  public input: { source: StyleStore | null } = {
    source: null,
  };

  public connectableTo: Record<string, typeof Edge[]> = {};

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public evaluate = async () => ({
    default: this.input.source,
  });

  public customControls = {
    source: () => <RenderSource edge={this} />,
  };
}
