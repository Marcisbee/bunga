import { Exome } from 'exome';

import { ComponentStore } from './component.store';
import { Edge } from './edges/edge';
import { SpaceStore } from './space.store';

export class BoundaryStore extends Exome {
  public x = 0;

  public y = 0;

  public width = 0;

  public height = 0;

  constructor(private space: SpaceStore) {
    super();
  }

  public updateBoundary() {
    const x: number[] = [];
    const w: number[] = [];

    const y: number[] = [];
    const h: number[] = [];

    const combinedItems = ([] as (ComponentStore | Edge)[])
      .concat(
        this.space.components,
        this.space.edges,
      );

    if (combinedItems.length === 0) {
      x.push(0);
      w.push(0);

      y.push(0);
      h.push(0);
    }

    combinedItems.forEach(({ position }) => {
      x.push(position.x);
      y.push(position.y);
    });

    this.x = Math.min(...x);
    this.y = Math.min(...y);

    combinedItems.forEach(({ position }) => {
      w.push(position.x + position.width);
      h.push(position.y + position.height);
    });

    this.width = Math.max(...w) + -(this.x);
    this.height = Math.max(...h) + -(this.y);
  }
}
