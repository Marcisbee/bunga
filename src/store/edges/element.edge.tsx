import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import { Suspense, useMemo } from 'react';
import { BehaviorSubject } from 'rxjs';

import { useObservable } from '../../hooks/use-observable';
import { store } from '../store';
import { StyleStore } from '../style.store';

import { Connection } from './connection';
import { Edge } from './edge';
import { ElementTextEdge } from './element-text.edge';
import { EdgePosition } from './position';
import { StyleEdge } from './style.edge';
import { SwitchEdge } from './switch.edge';

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

export function RenderElement({
  edge,
  children,
}: { edge: ElementEdge | ElementTextEdge, children: any }) {
  const { selectInput } = useStore(edge);

  const elementStyle = useObservable<StyleStore>(selectInput('style')!);

  const id = getExomeId(edge);

  return (
    <>
      {!!elementStyle && <RenderCss id={id} style={elementStyle} />}
      <div id={id}>
        {children}
      </div>
    </>
  );
}

function Render({ edge }: { edge: ElementEdge }) {
  useStore(edge);

  return (
    <div>
      <Suspense fallback="...">
        <RenderElement edge={edge}>
          Sample
        </RenderElement>
      </Suspense>
    </div>
  );
}

type ElementEdgeInput = {
  name: BehaviorSubject<string>;
  style: Connection | null;
}

export class ElementEdge extends Edge {
  public static title = 'Block Element';

  public style = 'element';

  public input: ElementEdgeInput = {
    name: new BehaviorSubject('Unknown'),
    style: null,
  };

  public connectableTo: Record<string, typeof Edge[]> = {
    style: [
      SwitchEdge,
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

  public selectOutput = (path: 'default') => undefined as any;

  public render = () => <Render edge={this} />;
}
