import dlv from 'dlv';
import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  mergeMap,
} from 'rxjs';

import { useObservable } from '../../hooks/use-observable';
import { ElementStore } from '../element.store';
import { interactiveModeStore } from '../interactive-mode.store';
import { store } from '../store';

import { Connection } from './connection';
import { Edge } from './edge';
import { ElementEdge } from './element/element.edge';

// eslint-disable-next-line no-shadow
export enum EventEdgeType {
  click = 'click',
}

export class EventEdge extends Edge {
  public static title = 'Event';

  public style = 'operation';

  public input = {
    element: new BehaviorSubject<ElementStore | null>(null),
    type: new BehaviorSubject<EventEdgeType>(EventEdgeType.click),
  };

  public connectableTo: Record<string, typeof Edge[]> = {};

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public select = {
    default: combineLatest([
      this.selectInput<ElementStore>('element'),
      this.selectInput<EventEdgeType>('type'),
    ]).pipe(
      filter(([target, name]) => !!target && !!name),
      mergeMap(([target, name]) => (
        interactiveModeStore.event
          .pipe(
            filter((event) => event.target === target && event.type === name),
            map((event) => event.payload),
          )
      )),
    ),
  };

  public customControls = {
    element: () => <ElementControl edge={this} />,
    type: () => <TypeControl edge={this} />,
  };
}

function ElementControlOption({ element, path }: { element: ElementStore, path: string[] }) {
  useStore(element);

  // const value = getExomeId(element);

  if (element.type instanceof ElementEdge) {
    return (
      <option value={path.join('.')}>
        {/* @TODO: Subscribe to name changes here */}
        {element.type.input.name.getValue()}
      </option>
    );
  }

  return (
    <option value={path.join('.')}>{element.type}</option>
  );
}

function ElementControl({ edge, path = [] }: { edge: EventEdge, path?: string[] }) {
  const { input } = useStore(edge);
  const { activeSpace } = useStore(store.activeProject!);
  const { components } = useStore(activeSpace);

  // const value = useObservable(input.element);

  return (
    <select
      defaultValue=""
      // value={value ? getExomeId(value) : ''}
      onChange={(e) => {
        const target: ElementStore = dlv(components, e.target.value);
        input.element.next(target);
      }}
      style={{
        border: 0,
        borderRadius: 3,
        fontSize: 12,
      }}
    >
      <option value="" disabled>Choose element</option>
      {components.map((component, componentIndex) => (
        <optgroup label={component.name}>
          {(component.root.children
            .map((element, elementIndex) => {
              if (!(element instanceof ElementStore)) {
                return null;
              }

              return (
                <ElementControlOption
                  key={`element-e-option-${getExomeId(component)}`}
                  path={path.concat([
                    String(componentIndex),
                    'root',
                    'children',
                    String(elementIndex),
                  ])}
                  element={element}
                />
              );
            })
          )}
        </optgroup>
      ))}
    </select>
  );
}

function TypeControl({ edge }: { edge: EventEdge }) {
  const { input } = useStore(edge);

  const value = useObservable(input.type);

  return (
    <select
      value={value || ''}
      onChange={(e) => {
        input.type.next(e.target.value as never);
      }}
      style={{
        border: 0,
        borderRadius: 3,
        fontSize: 12,
      }}
    >
      {Object.keys(EventEdgeType).map((name) => (
        <option
          key={`event-e-option-${name}`}
          value={name}
        >
          {name}
        </option>
      ))}
    </select>
  );
}
