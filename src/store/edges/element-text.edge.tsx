import { useStore } from 'exome/react';
import React from 'react';

import { Edge } from './edge';
import { Connection } from './connection';
import { NumberEdge } from './number.edge';
import { TextEdge } from './text.edge';
import { StyleEdge } from './style.edge';
import { RenderElement } from './element.edge';
import { BooleanEdge } from './boolean.edge';
import { MathEdge } from './math.edge';
import { EdgePosition } from './position';
import { store } from '../store';

function Render({ edge }: { edge: ElementTextEdge }) {
  const [value, setValue] = React.useState('');

  useStore(edge);

  React.useLayoutEffect(() => {
    edge.evaluate()
      .then((output) => {
        setValue(output?.default == null ? '' : output.default);
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
      BooleanEdge,
      NumberEdge,
      MathEdge,
    ],
    style: [
      StyleEdge,
    ],
  };

  public output: {} = {};

  constructor(
    public position: EdgePosition,
  ) {
    super(position);

    if (store.activeProject) {
      store.activeProject.customTextElements.push(this);
    }
  }

  public evaluate = async () => {
    const text = this.input.text;

    if (text == null) {
      return {
        default: '',
      };
    }

    const value = (await text.from.evaluate())?.[text.path]

    return {
      default: String(value == null ? '' : value),
    };
  }

  public render = () => <Render edge={this} />;
}
