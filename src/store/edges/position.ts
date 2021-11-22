import { Exome } from 'exome';

export class EdgePosition extends Exome {
  constructor(
    public type: 'edge' | 'element' = 'edge',
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

  public setHeight(height: number) {
    this.height = height;
  }

  public setWidth(width: number) {
    this.width = width;
  }
}