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
import { ComponentStore } from '../component.store';
import { ElementStore } from '../element.store';
import { InteractiveEventType, interactiveModeStore } from '../interactive-mode.store';
import { store } from '../store';

import { Connection } from './connection';
import { Edge } from './edge';
import { ElementEdge } from './element/element.edge';

export class MouseEventEdge extends Edge {
  public static title = 'Mouse Event';

  public style = 'operation';

  public input = {
    element: new BehaviorSubject<ElementStore | null>(null),
    type: new BehaviorSubject<keyof typeof InteractiveEventType>(InteractiveEventType.click),
  };

  public connectableTo: Record<string, typeof Edge[]> = {};

  public output: { default: Connection } = {
    default: new Connection(this, 'default'),
  };

  public select = {
    default: combineLatest([
      this.selectInput<ElementStore>('element'),
      this.selectInput<keyof typeof InteractiveEventType>('type'),
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

function ElementEdgeControlOption({ element, path }: { element: ElementStore, path: string[] }) {
  const edge = element.type as ElementEdge;

  useStore(edge);

  const value = useObservable(edge.input.name);

  return (
    <option value={path.join('.')}>
      {value}
    </option>
  );
}

function ElementControlOption({ element, path }: { element: ElementStore, path: string[] }) {
  useStore(element);

  if (element.type instanceof ElementEdge) {
    return (
      <ElementEdgeControlOption
        element={element}
        path={path}
      />
    );
  }

  return (
    <option value={path.join('.')}>{element.type}</option>
  );
}

function ComponentControlOption({
  component,
  path,
  index,
  eventId,
}: { component: ComponentStore, path: string[], index: number, eventId: string }) {
  const { name, root } = useStore(component);
  const { children } = useStore(root);

  return (
    <optgroup label={name}>
      {(children
        .map((element, elementIndex) => {
          if (!(element instanceof ElementStore)) {
            return null;
          }

          const childPath = path.concat([
            String(index),
            'root',
            'children',
            String(elementIndex),
          ]);

          return (
            <ElementControlOption
              key={`element-e-${eventId}-option-${getExomeId(component)}-${childPath.join('-')}`}
              path={childPath}
              element={element}
            />
          );
        })
      )}
    </optgroup>
  );
}

function ElementControl({ edge, path = [] }: { edge: MouseEventEdge, path?: string[] }) {
  const { input } = useStore(edge);
  const { activeSpace } = useStore(store.activeProject!);
  const { components } = useStore(activeSpace);

  return (
    <select
      // @TODO: Get default value path.
      defaultValue=""
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
        <ComponentControlOption
          component={component}
          key={`component-e-${getExomeId(edge)}-optgroup-${getExomeId(component)}`}
          path={path}
          index={componentIndex}
          eventId={getExomeId(edge)}
        />
      ))}
    </select>
  );
}

function TypeControl({ edge }: { edge: MouseEventEdge }) {
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
      {Object.keys(InteractiveEventType).map((name) => (
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
