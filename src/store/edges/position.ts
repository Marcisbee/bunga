import { Exome } from 'exome';

import { undoable } from '../undo.store';

export class EdgePositionSilent extends Exome {
  public x = 0;

  public y = 0;

  constructor(
    public parent: EdgePosition,
  ) {
    super();
  }

  public moveTo(x: number, y: number) {
    this.x = x;
    this.parent.x = x;
    this.y = y;
    this.parent.y = y;
  }
}

export class EdgePosition extends Exome {
  public readonly silent = new EdgePositionSilent(this);

  constructor(
    public type: 'edge' | 'element' = 'edge',
    public x = 0,
    public y = 0,
    public width = 0,
    public height = 0,
  ) {
    super();
  }

  @undoable({
    saveIntermediateActions: true,
    dependencies: [
      'x',
      'y',
    ],
  })
  public moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public setHeight(height: number) {
    this.height = height;
  }

  public setWidth(width: number) {
    this.width = width;
  }
}
