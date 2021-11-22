import { Exome } from 'exome';

import { ComponentStore } from './component.store';
import { Edge } from './edges/edge';

export class MoveStore extends Exome {
  public selectedEdges: Edge[] = [];
  public selectedComponents: ComponentStore[] = [];

  public get selectedAll(): (Edge | ComponentStore)[] {
    return ([] as (Edge | ComponentStore)[]).concat(this.selectedEdges, this.selectedComponents);
  }

  public selectEdge(edge: Edge, shiftKey: boolean = false) {
    if (!shiftKey) {
      this.selectedEdges = [edge];
      this.selectedComponents = [];
      return;
    }

    const index = this.selectedEdges.indexOf(edge);

    if (index > -1) {
      this.selectedEdges.splice(index, 1);
      return;
    }

    this.selectedEdges.push(edge);
  }

  public selectComponent(component: ComponentStore, shiftKey: boolean = false) {
    if (!shiftKey) {
      this.selectedComponents = [component];
      this.selectedEdges = [];
      return;
    }

    const index = this.selectedComponents.indexOf(component);

    if (index > -1) {
      this.selectedComponents.splice(index, 1);
      return;
    }

    this.selectedComponents.push(component);
  }

  public moveAllBy(x: number, y: number) {
    for (const { position } of this.selectedAll) {
      position.moveTo(position.x + x, position.y + y);
    }
  }

  public reset() {
    this.selectedEdges = [];
    this.selectedComponents = [];
  }
}

export const moveStore = new MoveStore();
