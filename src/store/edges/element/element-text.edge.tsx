import { useStore } from 'exome/react';
import { BehaviorSubject } from 'rxjs';

import { DraggablePreview } from '../../../components/draggable-preview/draggable-preview';
import { useObservable } from '../../../hooks/use-observable';
import { Constructor } from '../../../types/constructor';
import { interactiveModeStore } from '../../interactive-mode.store';
import { store } from '../../store';
import { Connection } from '../connection';
import { CountEdge } from '../data/count.edge';
import { BooleanEdge } from '../data/data.boolean.edge';
import { NumberEdge } from '../data/data.number.edge';
import { StringEdge } from '../data/data.string.edge';
import { Edge } from '../edge';
import { MathEdge } from '../math/math.edge';
import { EdgePosition } from '../position';

export class ElementTextEdge extends Edge {
  public static title = 'Text Element';

  public static style = 'element';

  public input = {
    text: new BehaviorSubject<Connection | null>(null),
  };

  public connectableTo: Record<string, Constructor<Edge>[]> = {
    text: [
      BooleanEdge,
      StringEdge,
      NumberEdge,
      MathEdge,
      CountEdge,
    ],
  };

  public output: Record<string, never> = {};

  constructor(
    public position: EdgePosition,
    id?: string,
  ) {
    super(position, id);

    if (store.activeProject) {
      store.activeProject.customTextElements.push(this);
    }
  }

  public select = {
    default: this.selectInput<string | number | null | undefined>('text')
      .pipe(),
  };

  public render = () => <Render edge={this} />;
}

function Render({ edge }: { edge: ElementTextEdge }) {
  const { select } = useStore(edge);
  const { isInteractive } = useStore(interactiveModeStore);

  const elementText = useObservable(select.default);

  if (isInteractive) {
    return (
      <div>
        {elementText}
      </div>
    );
  }

  return (
    <DraggablePreview preview={edge}>
      <div>
        {elementText}
      </div>
    </DraggablePreview>
  );
}
