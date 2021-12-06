/* eslint-disable no-useless-constructor */
import { Exome } from 'exome';
import { BehaviorSubject, filter, Subject } from 'rxjs';

import { ElementStore } from './element.store';
import { store } from './store';

export class InteractiveModeEvent {
  constructor(
    public readonly target: ElementStore,
    public readonly type: keyof typeof InteractiveEventType,
    public readonly payload: Event,
  ) {}
}

export class InteractiveModeStore extends Exome {
  public isInteractive = false;

  public isInteractive$ = new BehaviorSubject(this.isInteractive);

  private eventSource = new Subject<InteractiveModeEvent>();

  public event = this.eventSource
    .pipe(
      filter(() => this.isInteractive),
    );

  public dispatch(event: InteractiveModeEvent) {
    this.eventSource.next(event);
  }

  public setInteractive(isInteractive: boolean) {
    this.isInteractive = isInteractive;

    this.isInteractive$.next(isInteractive);

    store.activeProject!.activeSpace.move.reset();
  }
}

export const interactiveModeStore = new InteractiveModeStore();

export const InteractiveEventType = {
  click: 'click',
  mousedown: 'mousedown',
  mouseup: 'mouseup',
  mouseover: 'mouseover',
  mouseout: 'mouseout',
} as const;

export function useInteractiveEvents(element: ElementStore): React.HTMLAttributes<HTMLDivElement> {
  if (!interactiveModeStore.isInteractive) {
    return {};
  }

  return {
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();

      const interactiveEvent = new InteractiveModeEvent(
        element,
        'click',
        e.nativeEvent,
      );

      interactiveModeStore.dispatch(interactiveEvent);
    },
    onMouseDown: (e) => {
      e.preventDefault();
      e.stopPropagation();

      const interactiveEvent = new InteractiveModeEvent(
        element,
        'mousedown',
        e.nativeEvent,
      );

      interactiveModeStore.dispatch(interactiveEvent);
    },
    onMouseUp: (e) => {
      e.preventDefault();
      e.stopPropagation();

      const interactiveEvent = new InteractiveModeEvent(
        element,
        'mouseup',
        e.nativeEvent,
      );

      interactiveModeStore.dispatch(interactiveEvent);
    },
    onMouseOver: (e) => {
      e.preventDefault();
      e.stopPropagation();

      const interactiveEvent = new InteractiveModeEvent(
        element,
        'mouseover',
        e.nativeEvent,
      );

      interactiveModeStore.dispatch(interactiveEvent);
    },
    onMouseOut: (e) => {
      e.preventDefault();
      e.stopPropagation();

      const interactiveEvent = new InteractiveModeEvent(
        element,
        'mouseout',
        e.nativeEvent,
      );

      interactiveModeStore.dispatch(interactiveEvent);
    },
  };
}
