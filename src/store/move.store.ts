import { Exome } from 'exome';

import { ComponentStore } from './component.store';
import { Edge } from './edges/edge';
import { store } from './store';

interface Rectangle {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

function intersect(a: Rectangle, b: Rectangle) {
  return (a.left <= b.right &&
    b.left <= a.right &&
    a.top <= b.bottom &&
    b.top <= a.bottom)
}

export class SelectionStore extends Exome {
  public rootX: number = 0;
  public rootY: number = 0;
  public firstX: number = 0;
  public firstY: number = 0;
  public secondX: number = 0;
  public secondY: number = 0;

  public isSelecting = false;

  constructor(
    public move: MoveStore,
  ) {
    super();
  }

  public startSelection(rootX: number, rootY: number, x: number, y: number) {
    this.setIsSelecting(true);

    this.rootX = rootX;
    this.rootY = rootY;
    this.firstX = x;
    this.firstY = y;
    this.secondX = x;
    this.secondY = y;

    const handlerMove = (e: MouseEvent) => {
      e.stopPropagation();

      if (e.pageX === this.secondX && e.pageY === this.secondY) {
        return;
      }

      this.setPosition(e.pageX, e.pageY, e.shiftKey);
    }

    window.addEventListener('mousemove', handlerMove, { passive: true });

    const handlerEnd = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      this.setIsSelecting(false);

      window.removeEventListener('mousemove', handlerMove);

      window.removeEventListener('mouseup', handlerEnd);
      window.removeEventListener('mouseleave', handlerEnd);
      window.removeEventListener('mouseout', handlerEnd);
    }

    window.addEventListener('mouseup', handlerEnd);
    window.addEventListener('mouseleave', handlerEnd);
  }

  public setIsSelecting(toggle: boolean) {
    this.isSelecting = toggle;
  }

  public setPosition(x: number, y: number, shift: boolean = false) {
    this.secondX = x;
    this.secondY = y;

    const space = store.activeSpace!;

    const edgesToSelect: Edge[] = [];
    const componentsToSelect: ComponentStore[] = [];

    let startX: number;
    let endX: number;

    if (this.firstX < this.secondX) {
      startX = this.firstX - this.rootX;
      endX = this.secondX - this.rootX;
    } else {
      startX = this.secondX - this.rootX;
      endX = this.firstX - this.rootX;
    }

    let startY: number;
    let endY: number;

    if (this.firstY < this.secondY) {
      startY = this.firstY - this.rootY;
      endY = this.secondY - this.rootY;
    } else {
      startY = this.secondY - this.rootY;
      endY = this.firstY - this.rootY;
    }

    for (const edge of space.edges) {
      const position = edge.position;
      const isTouching = intersect({
        top: position.y,
        left: position.x,
        right: position.x + position.width,
        bottom: position.y + position.height,
      }, {
        top: startY,
        left: startX,
        right: endX,
        bottom: endY,
      });

      const index = this.move.selectedEdges.indexOf(edge);

      // Select
      if (isTouching && index === -1) {
        edgesToSelect.push(edge);
      }

      // Deselect
      if (!isTouching && index > -1) {
        edgesToSelect.push(edge);
      }
    }

    for (const component of space.components) {
      const position = component.position;
      const isTouching = intersect({
        top: position.y,
        left: position.x,
        right: position.x + position.width,
        bottom: position.y + position.height,
      }, {
        top: startY,
        left: startX,
        right: endX,
        bottom: endY,
      });

      const index = this.move.selectedComponents.indexOf(component);

      // Select
      if (isTouching && index === -1) {
        componentsToSelect.push(component);
      }

      // Deselect
      if (!isTouching && index > -1) {
        componentsToSelect.push(component);
      }
    }

    for (const edge of this.move.previouslySelectedEdges) {
      const index = edgesToSelect.indexOf(edge);

      if (index === -1) {
        edgesToSelect.push(edge);
      } else {
        edgesToSelect.splice(index, 1);
      }
    }

    for (const component of this.move.previouslySelectedComponents) {
      const index = componentsToSelect.indexOf(component);

      if (index === -1) {
        componentsToSelect.push(component);
      } else {
        componentsToSelect.splice(index, 1);
      }
    }

    for (const edge of edgesToSelect) {
      this.move.selectEdge(edge, true);
    }

    for (const component of componentsToSelect) {
      this.move.selectComponent(component, true);
    }
  }
}

export class MoveStore extends Exome {
  public previouslySelectedEdges: Edge[] = [];
  public previouslySelectedComponents: ComponentStore[] = [];

  public selectedEdges: Edge[] = [];
  public selectedComponents: ComponentStore[] = [];
  public mouseMove: [number, number] | null = null;
  public didMouseMove: boolean = false;

  private cachedAll: (Edge | ComponentStore)[] | null = null;

  public selection = new SelectionStore(this);

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

  public selectEdge(edge: Edge, shiftKey: boolean = false): boolean {
    this.cachedAll = null;

    if (!shiftKey) {
      this.selectedEdges = [edge];
      this.selectedComponents = [];
      return true;
    }

    const index = this.selectedEdges.indexOf(edge);

    if (index > -1) {
      this.selectedEdges.splice(index, 1);
      return false;
    }

    this.selectedEdges.push(edge);
    return true;
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
    this.previouslySelectedEdges = [];
    this.previouslySelectedComponents = [];
  }

  public save() {
    this.previouslySelectedEdges = this.selectedEdges.slice();
    this.previouslySelectedComponents = this.selectedComponents.slice();
  }
}

export const moveStore = new MoveStore();
