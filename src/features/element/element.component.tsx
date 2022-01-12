import { getExomeId } from 'exome';
import { useStore } from 'exome/react';
import {
  createElement,
  forwardRef,
  useRef,
} from 'react';

import { useDraggableElement } from '../../components/draggable-element/draggable-element';
import { DroppableElement, useDroppableElement } from '../../components/droppable-element/droppable-element';
import { DropPositionTypes } from '../../constants/drop-position-types';
import { ComponentStore } from '../../store/component.store';
import { StringEdge } from '../../store/edges/data/data.string.edge';
import { ElementTextStore } from '../../store/element-text.store';
import { ElementStore } from '../../store/element.store';
import { interactiveModeStore, useInteractiveEvents } from '../../store/interactive-mode.store';
import { ShapeStore } from '../../store/shape.edge';
import { store } from '../../store/store';
import { StyleStore } from '../../store/style.store';

// interface ElementChildrenComponentProps {
//   parent: ElementStore;
//   elements: (ElementStore | ElementTextStore)[];
// }

// export function ElementChildrenComponent({ parent, elements }: ElementChildrenComponentProps) {
//   const { isInteractive } = useStore(interactiveModeStore);
//   useStore(parent);

//   if (isInteractive) {
//     return (
//       <>
//         {elements.map((element) => (
//           <div
//             key={`element-c-${getExomeId(element)}`}
//             style={{ display: 'inline-block' }}
//           >
//             <ElementComponent
//               element={element}
//               parent={parent}
//             />
//           </div>
//         ))}
//       </>
//     );
//   }

//   return (
//     <>
//       {elements.map((element) => (
//         <ElementComponent element={element} parent={parent} />
//       ))}
//       {/* {elements.map((element) => (
//         <DraggableElement
//           key={`element-c-${getExomeId(element)}`}
//           parent={parent}
//           element={element}
//         >
//           <DroppableElement
//             parent={parent}
//             element={element}
//             position={DropPositionTypes.INSIDE}
//           >
//             <ElementComponent element={element} />
//           </DroppableElement>

//           <DroppableElement
//             parent={parent}
//             element={element}
//             position={DropPositionTypes.TOP}
//             style={{
//               position: 'absolute',
//               width: '100%',
//               height: '20%',
//               maxHeight: 20,
//               top: 0,
//               left: 0,
//               overflow: 'hidden',
//             }}
//           />
//           <DroppableElement
//             parent={parent}
//             element={element}
//             position={DropPositionTypes.BOTTOM}
//             style={{
//               position: 'absolute',
//               width: '100%',
//               height: '20%',
//               maxHeight: 20,
//               bottom: 0,
//               left: 0,
//               overflow: 'hidden',
//             }}
//           />
//         </DraggableElement>
//       ))} */}
//     </>
//   );
// }

// interface ElementComponentProps {
//   element: (ElementStore | ElementTextStore);
//   parent: ElementStore;
// }

// export function ElementComponent({ element, parent }: ElementComponentProps) {
//   if (element instanceof ElementTextStore) {
//     return (
//       <ElementTextComponent element={element} parent={parent} />
//     );
//   }

//   return (
//     <ElementBlockComponent element={element} parent={parent} />
//   );
// }

// interface ElementBlockComponentProps {
//   element: ElementStore;
//   parent: ElementStore;
// }

// function ElementBlockComponent({ parent, element }: ElementBlockComponentProps) {
//   // const ref = useRef<HTMLElement>(null);
//   const { isInteractive } = useStore(interactiveModeStore);
//   const { type, props, children } = useStore(element);
//   const events = useInteractiveEvents(element);

//   if (!type || typeof type === 'string') {
//     return createElement(
//       type,
//       {
//         ...props,
//         ...events,
//       },
//       (children && <ElementChildrenComponent parent={element} elements={children} />) || null,
//     );
//   }

//   if (type instanceof ComponentStore) {
//     return (
//       <ElementBlockComponent element={type.root} parent={element} />
//     );
//   }

//   return (
//     <RenderElement
//       edge={type}
//       {...events}
//     >
//       {(children && children.length > 0) ? (
//         <ElementChildrenComponent parent={element} elements={children} />
//       ) : (
//         !isInteractive && (
//           <span
//             // eslint-disable-next-line react/no-danger
//             dangerouslySetInnerHTML={{
//               __html: '&nbsp;&nbsp;&nbsp;',
//             }}
//             style={{
//               cursor: 'text',
//             }}
//             // onDoubleClick={(e) => {
//             //   e.preventDefault();
//             //   e.stopPropagation();

//             //   const project = store.activeProject!;
//             //   const space = project.activeSpace;

//             //   const textEdge = space.addEdge(StringEdge);
//             //   const textElementEdge = space.addEdge(ElementTextEdge);

//             //   // textEdge.setAutofocus();
//             //   textEdge.output.default.connect('text', textElementEdge);

//             //   element.append(new ElementTextStore(textElementEdge));
//             // }}
//           />
//         )
//       )}
//     </RenderElement>
//   );
// }

// interface ElementTextComponentProps {
//   element: ElementTextStore;
//   parent: ElementStore;
// }

// function ElementTextComponent({ element, parent }: ElementTextComponentProps) {
//   const { text } = useStore(element);

//   if (typeof text === 'string') {
//     return createElement('span', { }, text);
//   }

//   return createElement('span', { }, JSON.stringify(text));
// }

// export function RenderCss({ style, id }: { style: StyleStore, id: string }) {
//   const { css } = useStore(style);
//   const { tokens } = useStore(store.activeProject!.tokens[0]);

//   return (
//     <style>
//       {`:host {${tokens}}`}
//       {`#${id} {${css}}`}
//     </style>
//   );
// }

// interface RenderElementProps extends React.HTMLAttributes<HTMLDivElement> {
//   edge: ShapeStore,
//   defaultCss?: string,
//   children?: React.ReactNode,
// }

// export function RenderElement({
//   edge,
//   children,
//   defaultCss,
//   ...props
// }: RenderElementProps) {
//   const { style } = useStore(edge);
//   // const { drag } = useDraggableElement({ element, parent });
//   // const { drop } = useDroppableElement({ element, parent });

//   // drag(drop(ref));

//   const id = getExomeId(edge);

//   return (
//     <>
//       <RenderCss id={id} style={style} />
//       {createElement(style.type, { ...props, id }, children)}
//     </>
//   );
// }

interface RenderChildrenComponentProps {
  parent: ElementStore;
  elements: (ElementStore | ElementTextStore)[];
}

export function RenderChildrenComponent({ parent, elements }: RenderChildrenComponentProps) {
  // const { isInteractive } = useStore(interactiveModeStore);
  useStore(parent);

  // if (isInteractive) {
  //   return (
  //     <>
  //       {elements.map((element) => (
  //         <div
  //           key={`element-c-${getExomeId(element)}`}
  //           style={{ display: 'inline-block' }}
  //         >
  //           <ElementComponent
  //             element={element}
  //             parent={parent}
  //           />
  //         </div>
  //       ))}
  //     </>
  //   );
  // }

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

function RenderTextComponent({ element, parent }: RenderTextComponentProps) {
  const ref = useRef<HTMLElement>(null);
  const { text } = useStore(element);

  if (typeof text === 'string') {
    return createElement('span', { ref }, text);
  }

  return createElement('span', { ref }, JSON.stringify(text));
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

function RenderShapeComponent({ element, parent }: RenderShapeComponentProps) {
  const ref = useRef<HTMLElement>(null);
  const { type } = useStore(element);
  const { style } = useStore(type);
  // const { drag } = useDraggableElement({ element, parent });
  // const { drop } = useDroppableElement({ element, parent });

  // drag(drop(ref));

  const id = getExomeId(type);

  return (
    <>
      <RenderCssComponent id={id} style={style} />
      {createElement(style.type, { ...element.props, ref, id }, element.children)}
    </>
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
  const ref = useRef<HTMLElement>(null);
  const { type } = useStore(element);
  const { root } = useStore(type);
  const { drag } = useDraggableElement({ element, parent });
  const { drop, canDrop, isOver } = useDroppableElement({ element, parent });

  drag(drop(ref));

  // const id = getExomeId(type);

  return (
    <span
      ref={ref}
      style={{ display: 'inline-block' }}
      data-can-drop={String(canDrop)}
      data-is-over={String(isOver)}
    >
      {/* @TODO: Render proper React children */}
      <RenderChildrenComponent
        parent={parent}
        elements={root.children}
      />
    </span>
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
