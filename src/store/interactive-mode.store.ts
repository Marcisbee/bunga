/* eslint-disable no-useless-constructor */
import { Exome } from 'exome';
import { BehaviorSubject, filter, Subject } from 'rxjs';

import { ElementStore } from './element.store';
import { store } from './store';

export class InteractiveModeEvent {
  constructor(
    public readonly target: ElementStore,
    public readonly type: string,
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
