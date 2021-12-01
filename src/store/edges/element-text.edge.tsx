import { useStore } from 'exome/react';
import { BehaviorSubject } from 'rxjs';

import { DraggablePreview } from '../../components/draggable-preview/draggable-preview';
import { useObservable } from '../../hooks/use-observable';
import { store } from '../store';

import { Connection } from './connection';
import { BooleanEdge } from './data/data.boolean.edge';
import { NumberEdge } from './data/data.number.edge';
import { StringEdge } from './data/data.string.edge';
import { Edge } from './edge';
import { MathEdge } from './math/math.edge';
import { EdgePosition } from './position';

export class ElementTextEdge extends Edge {
  public static title = 'Text Element';

  public style = 'element';

  public input = {
    text: new BehaviorSubject<Connection | null>(null),
  };

  public connectableTo: Record<string, typeof Edge[]> = {
    text: [
      BooleanEdge,
      StringEdge,
      NumberEdge,
      MathEdge,
    ],
  };

  public output: Record<string, never> = {};

  constructor(
    public position: EdgePosition,
  ) {
    super(position);

    if (store.activeProject) {
      store.activeProject.customTextElements.push(this);
    }
  }

  public select = {
    default: this.selectInput<string | number | null | undefined>('text'),
  };

  public render = () => <Render edge={this} />;
}

function Render({ edge }: { edge: ElementTextEdge }) {
  const { select } = useStore(edge);

  const elementText = useObservable(select.default);

  return (
    <DraggablePreview preview={edge}>
      <div>
        {elementText}
      </div>
    </DraggablePreview>
  );
}
