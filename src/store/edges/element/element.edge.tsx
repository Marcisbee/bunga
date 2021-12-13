import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import { BehaviorSubject } from 'rxjs';

import { DraggablePreview } from '../../../components/draggable-preview/draggable-preview';
import { useObservable } from '../../../hooks/use-observable';
import { Constructor } from '../../../types/constructor';
import { observableToPromise } from '../../../utils/observable-to-promise';
import { interactiveModeStore } from '../../interactive-mode.store';
import { store } from '../../store';
import { StyleStore } from '../../style.store';
import { undoable } from '../../undo.store';
import { Connection } from '../connection';
import { ArrayConcatEdge } from '../data/data.array-concat.edge';
import { Edge } from '../edge';
import { LogicGateEdge } from '../logic/logic.gate.edge';
import { EdgePosition } from '../position';
import { StyleEdge } from '../style.edge';

export class ElementEdge extends Edge {
  public static title = 'Styled Element';

  public style = 'element';

  public input = {
    name: new BehaviorSubject<string>('Unknown'),
    style: new BehaviorSubject<Connection | null>(null),
  };

  public connectableTo: Record<string, Constructor<Edge>[]> = {
    style: [
      LogicGateEdge,
      StyleEdge,
      ArrayConcatEdge,
    ],
  };

  public output: Record<string, never> = {};

  constructor(
    public position: EdgePosition,
  ) {
    super(position);

    if (store.activeProject) {
      store.activeProject.customBlockElements.push(this);
    }
  }

  public select = {
    default: this.selectInput<StyleStore | StyleStore[] | null | undefined>('style').pipe(),
  };

  public customControls = {
    name: () => <RenderValue edge={this} />,
  };

  public render = () => <Render edge={this} />;

  @undoable<ElementEdge>({
    saveHandler(instance) {
      return instance.input.name.getValue();
    },
    restoreHandler(instance, payload, savedValue) {
      instance.input.name.next(savedValue || null);
    },
  })
  public updateInputName(value: string) {
    this.input.name.next(value);
  }
}

function RenderValue({ edge }: { edge: ElementEdge }) {
  const { input, updateInputName } = useStore(edge);
  const value = useObservable(input.name);

  return (
    <input
      type="text"
      value={value || ''}
      onInput={(event) => {
        updateInputName((event.target as HTMLInputElement).value);
      }}
      style={{
        fontSize: 11,
        width: 80,
        padding: 1,
        border: 0,
        borderRadius: 2,
        backgroundColor: '#fff',
        fontWeight: 'bold',
      }}
    />
  );
}

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

interface RenderElementProps extends React.HTMLAttributes<HTMLDivElement> {
  edge: ElementEdge,
  defaultCss?: string,
  children?: React.ReactNode,
}

export function RenderElement({
  edge,
  children,
  defaultCss,
  ...props
}: RenderElementProps) {
  const { select } = useStore(edge);

  const elementStyle = useObservable(select.default);

  const id = getExomeId(edge);

  return (
    <>
      {elementStyle ? (
        elementStyle instanceof Array ? (
          elementStyle
            .filter((style) => !!style)
            .map((style) => (
              <RenderCss id={id} style={style} />
            ))
        ) : (
          <RenderCss id={id} style={elementStyle} />
        )
      ) : (
        defaultCss && (
          <style>{`#${id} { ${defaultCss} }`}</style>
        )
      )}
      <div {...props} id={id}>
        {children}
      </div>
    </>
  );
}

function Render({ edge }: { edge: ElementEdge }) {
  useStore(edge);

  const { isInteractive } = useStore(interactiveModeStore);

  const element = (
    <div
      onDoubleClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const connectedStyle = await observableToPromise(edge.input.style);
        const project = store.activeProject!;
        const space = project.activeSpace;

        if (connectedStyle) {
          // Select connected style.
          const value = await observableToPromise(connectedStyle.from.select.default);

          if (value instanceof StyleStore) {
            project.activeStyle.setActive(value);
          }

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
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
          }}
        />
      </RenderElement>
    </div>
  );

  if (isInteractive) {
    return element;
  }

  return (
    <DraggablePreview preview={edge}>
      {element}
    </DraggablePreview>
  );
}
