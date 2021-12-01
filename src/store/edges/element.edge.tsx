import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import { BehaviorSubject } from 'rxjs';

import { DraggablePreview } from '../../components/draggable-preview/draggable-preview';
import { useObservable } from '../../hooks/use-observable';
import { store } from '../store';
import { StyleStore } from '../style.store';

import { Connection } from './connection';
import { Edge } from './edge';
import { ElementTextEdge } from './element-text.edge';
import { GateEdge } from './gate.edge';
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

export function RenderElement({
  edge,
  children,
  defaultCss,
}: { edge: ElementEdge | ElementTextEdge, defaultCss?: string, children: any }) {
  const { selectInput } = useStore(edge);

  const elementStyle = useObservable<StyleStore>(selectInput('style')!);

  const id = getExomeId(edge);

  return (
    <>
      {elementStyle ? (
        <RenderCss id={id} style={elementStyle} />
      ) : (
        defaultCss && (
          <style>{`#${id} { ${defaultCss} }`}</style>
        )
      )}
      <div id={id}>
        {children}
      </div>
    </>
  );
}

function Render({ edge }: { edge: ElementEdge }) {
  useStore(edge);

  return (
    <DraggablePreview preview={edge}>
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
        <RenderElement
          edge={edge}
          defaultCss="background-color: #ccc;"
        >
          <span
            dangerouslySetInnerHTML={{
              __html: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
            }}
          />
        </RenderElement>
      </div>
    </DraggablePreview>
  );
}

type ElementEdgeInput = {
  name: BehaviorSubject<string>;
  style: Connection | null;
}

export class ElementEdge extends Edge {
  public static title = 'Styled Element';

  public style = 'element';

  public input: ElementEdgeInput = {
    name: new BehaviorSubject('Unknown'),
    style: null,
  };

  public connectableTo: Record<string, typeof Edge[]> = {
    style: [
      GateEdge,
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

  protected onInputConnected = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.input.style2 = null;
    this.connectableTo.style2 = this.connectableTo.style;
  };

  protected onInputDisconnected = (path: string) => {
    if (path === 'style') {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete this.input[path];
    delete this.connectableTo[path];
  };
}
