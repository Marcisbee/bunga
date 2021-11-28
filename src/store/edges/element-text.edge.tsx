import { useStore } from 'exome/react';

import { DraggablePreview } from '../../components/draggable-preview/draggable-preview';
import { useObservable } from '../../hooks/use-observable';
import { store } from '../store';

import { BooleanEdge } from './boolean.edge';
import { Connection } from './connection';
import { Edge } from './edge';
import { RenderElement } from './element.edge';
import { MathEdge } from './math.edge';
import { NumberEdge } from './number.edge';
import { EdgePosition } from './position';
import { TextEdge } from './text.edge';

function Render({ edge }: { edge: ElementTextEdge }) {
  const { selectInput } = useStore(edge);

  const elementText = useObservable<string>(selectInput('text')!);

  return (
    <DraggablePreview preview={edge}>
      <RenderElement edge={edge}>
        {elementText}
      </RenderElement>
    </DraggablePreview>
  );
}

type ElementTextEdgeInput = {
  text: Connection | null;
}

export class ElementTextEdge extends Edge {
  public static title = 'Text Element';

  public style = 'element';

  public input: ElementTextEdgeInput = {
    text: null,
  };

  public connectableTo: Record<string, typeof Edge[]> = {
    text: [
      TextEdge,
      BooleanEdge,
      NumberEdge,
      MathEdge,
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
