import { useStore } from 'exome/react';
import React from 'react';

import { Edge } from './edge';
import { Connection } from './connection';
import { NumberEdge } from './number.edge';
import { MathAddEdge } from './math-add.edge';
import { TextEdge } from './text.edge';
import { StyleEdge } from './style.edge';
import { RenderElement } from './element.edge';

function Render({ edge }: { edge: ElementTextEdge }) {
  const [value, setValue] = React.useState('');

  useStore(edge);

  React.useLayoutEffect(() => {
    edge.evaluate()
      .then((output) => {
        setValue(output?.default || '');
      });
  });

  return (
    <div>
      <RenderElement edge={edge}>
        {value}
      </RenderElement>
    </div>
  );
}

export class ElementTextEdge extends Edge {
  public static title = 'Text Element';
  public style = 'element';

  public input: { text: Connection | null, style: Connection | null } = {
    text: null,
    style: null,
  };
  public connectableTo: Record<string, typeof Edge[]> = {
    text: [
      TextEdge,
      NumberEdge,
      MathAddEdge,
    ],
    style: [
      StyleEdge,
    ],
  };

  public output: {} = {};

  public evaluate = async () => {
    const text = this.input.text;

    if (!text) {
      return {
        default: '',
      };
    }

    return {
      default: String((await text.from.evaluate())?.[text.path] || ''),
    };
  }

  public render = () => <Render edge={this} />;
}
