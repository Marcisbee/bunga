import { Exome } from 'exome';

import { Edge } from './edge';

export class PendingPosition extends Exome {
  public x = 0;

  public y = 0;

  public moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class PendingEdge extends Exome {
  public from: [string, Edge] | null = null;

  public position = new PendingPosition();

  public setFrom(output: string, from: Edge) {
    if (from.output[output] === undefined) {
      throw new Error(`Output "${output}" does not exist on \`${from.title}\` edge. Valid options are ${JSON.stringify(Object.keys(from.output))}.`);
    }

    this.from = [output, from];
    this.position.moveTo(0, 0);
  }

  public unsetFrom() {
    this.from = null;
  }

  public connectTo(input: string, to: Edge) {
    this.from![1].output[this.from![0]].connect(input, to);
    // console.log('Connect', this.from, 'to', [input, to]);
    this.unsetFrom();
  }
}

export const pendingEdge = new PendingEdge();
