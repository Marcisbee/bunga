import { Exome } from 'exome';

import { Edge } from './edge';

export class PendingEdge extends Exome {
  public from: [string, Edge] | null = null;

  public setFrom(output: string, from: Edge) {
    this.from = [output, from];
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
