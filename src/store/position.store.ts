import { Exome } from 'exome';

export class PositionStore extends Exome {
  public x = 0;

  public y = 0;

  public before = {
    x: 0,
    y: 0,
  };

  public setPosition(x: number, y: number) {
    this.before.x = this.x;
    this.before.y = this.y;

    this.x = x;
    this.y = y;
  }

  public async resetPosition() {
    return Promise
      .resolve()
      .then(() => {
        this.setPosition(0, 0);
      });
  }
}
