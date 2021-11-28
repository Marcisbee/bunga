import { useStore } from 'exome/react';

import { useObservable } from '../../hooks/use-observable';
import { store } from '../store';
import { StyleStore } from '../style.store';

import { BooleanEdge } from './boolean.edge';
import { Connection } from './connection';
import { Edge } from './edge';
import { RenderElement } from './element.edge';
import { MathEdge } from './math.edge';
import { NumberEdge } from './number.edge';
import { EdgePosition } from './position';
import { StyleEdge } from './style.edge';
import { SwitchEdge } from './switch.edge';
import { TextEdge } from './text.edge';

function Render({ edge }: { edge: ElementTextEdge }) {
  const { selectInput } = useStore(edge);

  const elementText = useObservable<string>(selectInput('text')!);

  return (
    <div
      onDoubleClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        const connectedStyle = edge.input.style;
        const project = store.activeProject!;
        const space = project.activeSpace;

        if (connectedStyle) {
          // Select connected style.
          connectedStyle.from
            .selectOutput('default')
            .subscribe((value) => {
              if (value instanceof StyleStore) {
                project.activeStyle.setActive(value);
              }
            })
            .unsubscribe();
          return;
        }

        // Create new style and connect to element.
        const style = project.addStyle();
        const styleEdge = space.addEdge(StyleEdge);

        styleEdge.input.source.next(style);
        styleEdge.output.default.connect('style', edge);
      }}
    >
      <RenderElement edge={edge}>
        {elementText}
      </RenderElement>
    </div>
  );
}

type ElementTextEdgeInput = {
  text: Connection | null;
  style: Connection | null;
}

export class ElementTextEdge extends Edge {
  public static title = 'Text Element';

  public style = 'element';

  public input: ElementTextEdgeInput = {
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
      store.activeProject.customTextElements.push(this);
    }
  }

  public selectOutput = (path: 'default') => undefined as any;

  public render = () => <Render edge={this} />;
}
