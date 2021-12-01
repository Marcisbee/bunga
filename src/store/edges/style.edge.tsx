import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import { BehaviorSubject } from 'rxjs';

import { useObservable } from '../../hooks/use-observable';
import { store } from '../store';
import { StyleStore } from '../style.store';

import { Connection } from './connection';
import { Edge } from './edge';

export class StyleEdge extends Edge {
  public static title = 'Style';

  public style = 'style';

  public input = {
    source: new BehaviorSubject<StyleStore | null>(null),
  };

  public connectableTo: Record<string, typeof Edge[]> = {};

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public select = {
    default: this.selectInput<StyleStore | null>('source').pipe(),
  };

  public customControls = {
    source: () => <RenderSource edge={this} />,
  };
}

function RenderSourceOption({ style }: { style: StyleStore }) {
  const { name } = useStore(style);

  return (
    <option value={getExomeId(style)}>{name}</option>
  );
}

function RenderSource({ edge }: { edge: StyleEdge }) {
  const { input } = useStore(edge);
  const { styles: stylesList } = useStore(store.activeProject!);

  const value = useObservable(input.source);

  return (
    <select
      value={value ? getExomeId(value) : ''}
      onChange={(e) => {
        const selectedStyle = stylesList.find((s) => getExomeId(s) === e.target.value)!;

        input.source.next(selectedStyle);
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
