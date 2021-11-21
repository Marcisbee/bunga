import { useStore } from 'exome/react';
import React from 'react';

import { Edge } from './edge';
import { Connection } from './connection';
import { VariableEdge } from './variable.edge';
import { MathAddEdge } from './math-add.edge';

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
      {value}
    </div>
  );
}

export class ElementTextEdge extends Edge {
  public style = 'element';
  public name = 'Element Text';

  public input: { text: Connection | null } = {
    text: null,
  };
  public connectableTo: Record<string, typeof Edge[]> = {
    text: [
      VariableEdge,
      MathAddEdge,
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

