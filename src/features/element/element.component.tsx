import { Exome, getExomeId } from 'exome';
import { useStore } from 'exome/react';
import {
  createElement,
  memo,
  useContext,
  useMemo,
  useRef,
} from 'react';
import { combineLatest, map, Observable } from 'rxjs';

import { useObservable } from '../../hooks/use-observable';
import { ComponentStore } from '../../store/component.store';
import { ElementTextStore } from '../../store/element-text.store';
import { ElementStore } from '../../store/element.store';
import { interactiveModeStore, useInteractiveEvents } from '../../store/interactive-mode.store';
import { ShapeStore } from '../../store/shape.store';
import { store } from '../../store/store';
import { StyleStore } from '../../store/style.store';
import { ElementContext } from '../shape/shape.component';

function exomeArraySerializer(value: Exome[]): string {
  return value.map((v) => getExomeId(v)).join('|');
}

interface RenderChildrenComponentProps {
  parent: ElementStore;
  elements: (ElementStore | ElementTextStore)[];
}

function RenderChildrenComponentWrapper({ parent, elements }: RenderChildrenComponentProps) {
  useStore(parent);

  return (
    <>
      {elements.map((element) => (
        <RenderElementSwitchComponent
          key={`element-c-${getExomeId(element)}`}
          element={element}
          parent={parent}
        />
      ))}
    </>
  );
}

export const RenderChildrenComponent = memo(
  RenderChildrenComponentWrapper,
  (a, b) => (
    a.parent === b.parent
    && exomeArraySerializer(a.elements) === exomeArraySerializer(b.elements)
  ),
);

interface RenderElementSwitchComponentProps {
  element: (ElementStore | ElementTextStore);
  parent: ElementStore;
}

export function RenderElementSwitchComponent({
  element,
  parent,
}: RenderElementSwitchComponentProps) {
  if (element instanceof ElementTextStore) {
    return (
      <RenderTextComponent
        parent={parent}
        element={element}
      />
    );
  }

  if (element.type instanceof ComponentStore) {
    return (
      <RenderComponentComponent
        element={element as ElementStore<Record<string, never>, ComponentStore>}
        parent={parent}
      />
    );
  }

  if (element.type instanceof ShapeStore) {
    return (
      <RenderShapeComponent
        element={element as ElementStore<Record<string, never>, ShapeStore>}
        parent={parent}
      />
    );
  }

  return (
    <RenderElementComponent
      element={element as ElementStore<Record<string, never>, string>}
      parent={parent}
    />
  );
}

/**
 *********** Render text ************
 */

interface RenderTextComponentProps {
  parent: ElementStore;
  element: ElementTextStore;
}

function RenderDynamicTextComponent({ observable }: { observable: Observable<any> }) {
  return useObservable(observable);
}

function RenderTextComponent({ element, parent }: RenderTextComponentProps) {
  const { isInteractive } = useStore(interactiveModeStore);
  const { canEdit, variables } = useContext(ElementContext);
  const ref = useRef<HTMLElement>(null);
  const { text, setText } = useStore(element);

  const html = useMemo(() => ({
    __html: text,
  }), [text, isInteractive]);
  const htmlStringified = useMemo(() => ({
    __html: JSON.stringify(text),
  }), [text, isInteractive]);

  const dynamicText = useMemo(() => (
    combineLatest(
      variables.map((variable) => variable.select.both),
    ).pipe(
      map((variablesList) => (
        (typeof text === 'string' ? text : JSON.stringify(text))
          .replace(/\{([\w$]+)\}/g, (substring, name) => {
            const variable = variablesList.find((v) => v[0] === name);

            if (!variable) {
              return substring;
            }

            return variable[1] as string;
          })
      )),
    )), [text, exomeArraySerializer(variables)]);

  function onInput(e: React.ChangeEvent<HTMLSpanElement>) {
    e.stopPropagation();

    setText(e.target.textContent || '');
  }

  function onDoubleClick(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function onMouseDown(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    e.stopPropagation();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLSpanElement>) {
    e.stopPropagation();
  }

  if (typeof text === 'string') {
    if (isInteractive) {
      if (variables.length === 0) {
        return (
          <span>
            {text}
          </span>
        );
      }

      return (
        <span>
          <RenderDynamicTextComponent
            observable={dynamicText}
          />
        </span>
      );
    }

    return (
      <span
        ref={ref}
        tabIndex={canEdit ? -1 : undefined}
        contentEditable={canEdit}
        onInput={onInput}
        onDoubleClick={canEdit ? onDoubleClick : undefined}
        onMouseDown={onMouseDown}
        onKeyDown={onKeyDown}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={html}
        style={{
          cursor: canEdit ? 'text' : undefined,
          boxShadow: canEdit ? '0 2px 0 0 #0081f1' : undefined,
        }}
      />
    );
  }

  if (isInteractive) {
    if (variables.length === 0) {
      return (
        <span>
          {JSON.stringify(text)}
        </span>
      );
    }

    return (
      <span>
        <RenderDynamicTextComponent
          observable={dynamicText}
        />
      </span>
    );
  }

  return (
    <span
      ref={ref}
      tabIndex={canEdit ? -1 : undefined}
      contentEditable={canEdit}
      onInput={onInput}
      onDoubleClick={canEdit ? onDoubleClick : undefined}
      onMouseDown={onMouseDown}
      onKeyDown={onKeyDown}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={htmlStringified}
      style={{
        cursor: canEdit ? 'text' : undefined,
        boxShadow: canEdit ? '0 2px 0 0 #0081f1' : undefined,
      }}
    />
  );
}

/**
 *********** Render static element ************
 */

interface RenderElementComponentProps {
  parent: ElementStore;
  element: ElementStore<Record<string, never>, string>;
}

function RenderElementComponent({ element, parent }: RenderElementComponentProps) {
  const ref = useRef<HTMLElement>(null);
  const { type } = useStore(element);
  // const { drag } = useDraggableElement({ element, parent });
  // const { drop } = useDroppableElement({ element, parent });

  // drag(drop(ref));

  return createElement(type, { ...element.props, ref }, element.children);
}

/**
 *********** Render shape element ************
 */

interface RenderShapeComponentProps {
  parent: ElementStore;
  element: ElementStore<Record<string, never>, ShapeStore>;
}

export function RenderShapeComponent({ element, parent }: RenderShapeComponentProps) {
  const context = useContext(ElementContext);
  const ref = useRef<HTMLElement>(null);
  const { type } = useStore(element);
  const { style, variables } = useStore(type);
  const events = useInteractiveEvents(element);
  // const { drag } = useDraggableElement({ element, parent });
  // const { drop } = useDroppableElement({ element, parent });

  // drag(drop(ref));

  const id = getExomeId(type);

  return (
    <ElementContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        ...context,
        variables: [...context.variables, ...variables],
      }}
    >
      <RenderCssComponent id={id} style={style} />
      {createElement(
        style.type,
        {
          ...element.props,
          ref,
          id,
          ...events,
        },
        createElement(RenderChildrenComponent, {
          elements: element.type.root.children,
          parent: element.type.root,
        }),
      )}
    </ElementContext.Provider>
  );
}

/**
 *********** Render component element ************
 */

interface RenderComponentComponentProps {
  parent: ElementStore;
  element: ElementStore<Record<string, never>, ComponentStore>;
}

export function RenderComponentComponent({ element, parent }: RenderComponentComponentProps) {
  const { type } = useStore(element);
  const { root } = useStore(type);

  useStore(parent);

  return (
    <RenderChildrenComponent
      parent={parent}
      elements={root.children}
    />
  );
}

/**
 *********** Render CSS ************
 */

// @TODO: Move this to root & update via context
export function RenderCssComponent({ style, id }: { style: StyleStore, id: string }) {
  const { css } = useStore(style);
  const { tokens } = useStore(store.activeProject!.tokens[0]);

  return (
    <style>
      {`:host {${tokens}}`}
      {`#${id} {${css}}`}
    </style>
  );
}
