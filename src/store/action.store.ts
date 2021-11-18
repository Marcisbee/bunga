import { Exome } from 'exome';
import { ElementStore } from './element.store';

import { StyleStore } from './style.store';

export enum ActionType {
  PROP = 'prop',
  VAR = 'var',
  LOGIC = 'logic',
  STYLE = 'style',
};

export class ActionPositionStore extends Exome {
  constructor(
    public x = 0,
    public y = 0,
    public width = 0,
    public height = 0,
  ) {
    super();
  }

  public moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class ActionConnectionStore extends Exome {
  constructor(
    public type: ActionType,
    public from: ActionStore,
    public to: (ActionStore | ElementStore)[] = [],
  ) {
    super();
  }

  public addTo(to: ActionStore | ElementStore) {
    activeActionConnection.setFrom(null);
    this.to.push(to);

    if (to instanceof ElementStore) {
      to.addConnection(this);
    }
  }

  // Allows dom rect to be checked.
  public async reflow() {}
}

export class ActionStore extends Exome {
  public type: ActionType = ActionType.PROP;
  public connections: ActionConnectionStore[] = [];

  constructor(public position = new ActionPositionStore()) {
    super();
  }
}

export class ActionStyleStore extends ActionStore {
  public type = ActionType.STYLE;
  public style?: StyleStore;

  constructor(public position = new ActionPositionStore()) {
    super(position);

    this.connections.push(
      new ActionConnectionStore(ActionType.STYLE, this),
    );
  }

  public setStyle(style: StyleStore) {
    this.style = style;
  }
}

export class ActiveActionConnection extends Exome {
  public from: ActionConnectionStore | null = null;

  public setFrom(from: ActionConnectionStore | null) {
    this.from = from;
  }
}

export const activeActionConnection = new ActiveActionConnection();
