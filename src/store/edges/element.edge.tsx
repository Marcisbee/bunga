import { getExomeId } from 'exome';
import { useStore } from 'exome/react';

import { store } from '../store';
import { StyleStore } from '../style.store';

import { Connection } from './connection';
import { Edge } from './edge';
import { ElementTextEdge } from './element-text.edge';
import { EdgePosition } from './position';
import { StyleEdge } from './style.edge';

export function RenderCss({ style, id }: { style: StyleStore, id: string }) {
  const { css } = useStore(style);
  const { tokens } = useStore(store.activeProject!.tokens[0]);

  return (
    <style>
      {`:host {${tokens}}`}
      {`#${id} {${css}}`}
    </style>
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

export function RenderElement({
  edge,
  children,
}: { edge: ElementEdge | ElementTextEdge, children: any }) {
  return (
    <>
      {edge.input.style && edge.input.style.from && (
        <RenderCSSElement style={edge.input.style.from as StyleEdge} />
      )}
      <div
        id={edge.input.style?.from && getExomeId(edge.input.style.from)}
      >
        {edge.input.style?.from ? children : null}
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
  public static title = 'Block Element';

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

  public output: Record<string, any> = {};

  constructor(
    public position: EdgePosition,
  ) {
    super(position);

    if (store.activeProject) {
      store.activeProject.customBlockElements.push(this);
    }
  }

  public evaluate = async () => {
    const { style } = this.input;

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
  };

  public render = () => <Render edge={this} />;
}
