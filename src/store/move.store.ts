import { Exome } from 'exome';

import { ComponentStore } from './component.store';
import { Edge } from './edges/edge';

export class MoveStore extends Exome {
  public selectedEdges: Edge[] = [];
  public selectedComponents: ComponentStore[] = [];
  public mouseMove: [number, number] | null = null;
  public didMouseMove: boolean = false;

  private cachedAll: (Edge | ComponentStore)[] | null = null;

  public get selectedAll(): (Edge | ComponentStore)[] {
    if (this.cachedAll !== null) {
      return this.cachedAll;
    }

    return this.cachedAll = ([] as (Edge | ComponentStore)[]).concat(this.selectedEdges, this.selectedComponents);
  }

  public startMouseMove(x: number, y: number) {
    this.didMouseMove = false;
    this.mouseMove = [x, y];

    const handlerMove = (e: MouseEvent) => {
      e.stopPropagation();

      this.didMouseMove = true;

      const diffX = e.pageX - this.mouseMove![0];
      const diffY = e.pageY - this.mouseMove![1];

      if (diffX === 0 && diffY === 0) {
        return;
      }

      this.moveAllBy(diffX, diffY);

      this.mouseMove = [e.pageX, e.pageY];
    }

    window.addEventListener('mousemove', handlerMove, { passive: true });

    const handlerEnd = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      window.removeEventListener('mousemove', handlerMove);

      window.removeEventListener('mouseup', handlerEnd);
      window.removeEventListener('mouseleave', handlerEnd);
      window.removeEventListener('mouseout', handlerEnd);

      this.endMouseMove();
    }

    window.addEventListener('mouseup', handlerEnd);
    window.addEventListener('mouseleave', handlerEnd);
  }

  public endMouseMove() {
    this.mouseMove = null;
  }

  public selectEdge(edge: Edge, shiftKey: boolean = false) {
    this.cachedAll = null;

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
    this.cachedAll = null;

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

  public moveAllBy = (x: number, y: number) => {
    window.requestAnimationFrame(() => {
      for (const { position } of this.selectedAll) {
        position.silent.moveTo(position.x + x, position.y + y);
      }
    });
  }

  public reset() {
    this.cachedAll = null;

    this.selectedEdges = [];
    this.selectedComponents = [];
  }
}

export const moveStore = new MoveStore();
