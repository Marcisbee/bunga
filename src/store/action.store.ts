import { Exome } from 'exome';
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

export class ActionStore extends Exome {
  public position = new ActionPositionStore();
  public type: ActionType = ActionType.PROP;
}

export class ActionStyleStore extends ActionStore {
  public type = ActionType.STYLE;
  public style?: StyleStore;

  public setStyle(style: StyleStore) {
    this.style = style;
  }
}
