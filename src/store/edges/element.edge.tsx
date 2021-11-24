import { useStore } from 'exome/react';

import { StyleStore } from '../style.store';
import { store } from '../store';

import { Edge } from './edge';
import { Connection } from './connection';
import { StyleEdge } from './style.edge';
import { EdgePosition } from './position';
import { getExomeId } from 'exome';

export function RenderCss({ style, id }: { style: StyleStore, id: string }) {
  const { css } = useStore(style);
  const { tokens } = useStore(store.activeSpace!.tokens[0]);

  return (
    <style>{`:host {${tokens}}`}{`#${id} { ${css}}`}</style>
  );
}

export function RenderCSSElement({ style }: { style: StyleEdge }) {
  const { input } = useStore(style);

  if (!input.source) {
    return null;
  }

  return (
    <RenderCss style={input.source} id={getExomeId(style)} />
  );
}

export function RenderElement({ edge, children }: { edge: ElementEdge, children: any }) {
  return (
    <>
      {edge.input.style && edge.input.style.from && (
        <RenderCSSElement style={edge.input.style.from as StyleEdge} />
      )}
      <div id={edge.input.style?.from && getExomeId(edge.input.style.from)}>
        {children}
      </div>
    </>
  );
}

function Render({ edge }: { edge: ElementEdge }) {
  return (
    <div>
      <RenderElement edge={edge}>
        Sample
      </RenderElement>
    </div>
  );
}

export class ElementEdge extends Edge {
  public static title = 'Element';
  public style = 'element';

  public input: { name: string, style: Connection | null } = {
    name: 'unknown',
    style: null,
  };
  public connectableTo: Record<string, typeof Edge[]> = {
    style: [
      StyleEdge,
    ],
  };

  public output: {} = {};

  constructor(
    public position: EdgePosition,
  ) {
    super(position);

    if (store.activeSpace) {
      store.activeSpace.customElements.push(this);
    }
  }

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
