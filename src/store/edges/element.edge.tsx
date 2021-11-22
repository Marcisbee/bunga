import { useStore } from 'exome/react';

import { StyleStore } from '../style.store';
import { store } from '../store';

import { Edge } from './edge';
import { Connection } from './connection';
import { StyleEdge } from './style.edge';

function RenderCss({ style }: { style: StyleStore }) {
  const { css } = useStore(style);
  const { tokens } = useStore(store.activeSpace!.tokens[0]);

  return (
    <style>{`:host {${tokens}}`}{`#obj { ${css}}`}</style>
  );
}

function RenderEdge({ style }: { style: StyleEdge }) {
  const { input } = useStore(style);

  if (!input.source) {
    return null;
  }

  return (
    <RenderCss style={input.source} />
  );
}

function Render({ edge }: { edge: ElementEdge }) {
  return (
    <>
      {edge.input.style && edge.input.style.from && (
        <RenderEdge style={edge.input.style.from as StyleEdge} />
      )}
      <div>
        <div id="obj">Hello</div>
      </div>
    </>
  );
}

export class ElementEdge extends Edge {
  public style = 'element';
  public name = 'Element';

  public input: { style: Connection | null } = {
    style: null,
  };
  public connectableTo: Record<string, typeof Edge[]> = {
    style: [
      StyleEdge,
    ],
  };

  public output: {} = {};

  public evaluate = async () => {
    const style = this.input.style;

    if (!style) {
      return {
        style: [],
      };
    }

    return {
      style: [
        (await style.from.evaluate())?.[style.path],
      ],
    };
  }

  public render = () => <Render edge={this} />;
}
