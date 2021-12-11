/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Exome,
  getExomeId,
  updateMap,
} from 'exome';

interface Trace {
  store: string;
  instance: Exome;
  action: string;
  state: string;
  dependencies?: string[];
}

const refs = new Map<string, Exome>();

function saveLocalState(instance: Exome, dependencies?: string[]): string {
  const saveableObject: Record<string, any> = {};

  Object.keys(instance)
    .forEach((key) => {
      const value = (instance as any)[key];

      if (dependencies && dependencies.indexOf(key) === -1) {
        return;
      }

      saveableObject[key] = value;
    });

  return JSON.stringify(saveableObject, ((key, value) => {
    if (key === '') {
      return value;
    }

    if (value instanceof Exome) {
      const id = getExomeId(value);

      refs.set(id, value);

      return `__$$$ExomeUndoReference:${id}`;
    }

    return value;
  }), 2);
}

function loadLocalState(instance: Exome, state: string): void {
  const stateObject = JSON.parse(state, (key, value) => {
    if (typeof value === 'string' && /^__\$\$\$ExomeUndoReference:/.test(value)) {
      const id = value.substr(24);

      return refs.get(id);
    }

    return value;
  });

  Object.keys(stateObject)
    .forEach((key) => {
      const value = stateObject[key];

      (instance as any)[key] = value;
    });

  const id = getExomeId(instance);

  const renderers = updateMap[id] === undefined ? [] : updateMap[id];
  updateMap[id] = [];
  renderers.forEach((renderer) => renderer());
}

class Undo extends Exome {
  private undoStack: Trace[][] = [];

  private redoStack: Trace[][] = [];

  public get canUndo() {
    return (this.undoStack || []).length > 0;
  }

  public get canRedo() {
    return (this.redoStack || []).length > 0;
  }

  private nextTickId = 0;

  private tickId = 0;

  constructor(
    private maxSize = 30,
  ) {
    super();
  }

  public undo() {
    const undo = this.undoStack.pop();

    if (!undo || !undo[0]) {
      return;
    }

    loadLocalState(undo[0].instance, undo[0].state);

    this.redoStack.push(undo);
  }

  public redo() {
    const redo = this.redoStack.pop();

    if (!redo) {
      return;
    }

    const next = redo[redo.length - 1];

    if (!next) {
      return;
    }

    loadLocalState(next.instance, next.state);

    this.undoStack.push(redo);
  }

  public clear() {
    this.undoStack = [];
    this.redoStack = [];
  }

  public undoable = ({
    saveIntermediateActions,
    dependencies,
  }: {
    saveIntermediateActions?: boolean,
    dependencies?: string[],
  } = {}) => (
    target: Exome,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const fn = descriptor.value!;
    const self = this;

    descriptor.value = function value(...args: any[]) {
      if (!(this instanceof Exome)) {
        return;
      }

      // @TODO: Bundle changes if they happen in same tick.
      // let didChangeId = false;

      // if (self.tickId === self.nextTickId) {
      //   didChangeId = true;
      //   self.nextTickId = self.tickId + 1;
      // }

      // Promise.resolve().then(() => {
      //   self.tickId = self.nextTickId;
      // });

      const trace = {
        store: target.constructor.name,
        instance: this,
        action: propertyKey,
        state: saveLocalState(this, dependencies),
        dependencies,
      };

      if (!saveIntermediateActions) {
        const lastUndo = self.undoStack[self.undoStack.length - 1];

        if (lastUndo
            && lastUndo[0].instance === trace.instance
            && lastUndo[0].action === trace.action) {
          return self.replaceLastUndoStack(trace, fn.call(this, ...args));
        }
      }

      return self.pushToUndoStack(trace, fn.call(this, ...args));
    };

    return descriptor;
  };

  private replaceLastUndoStack<T = any>(trace: any, output: T): T {
    const lastUndo = this.undoStack[this.undoStack.length - 1];

    lastUndo.splice(1, 1, {
      store: trace.store,
      instance: trace.instance,
      action: trace.action,
      state: saveLocalState(trace.instance, trace.dependencies),
      dependencies: trace.dependencies,
    });

    this.redoStack = [];

    return output;
  }

  private pushToUndoStack<T = any>(trace: any, output: T): T {
    this.undoStack.push([
      trace,
      {
        store: trace.store,
        instance: trace.instance,
        action: trace.action,
        state: saveLocalState(trace.instance, trace.dependencies),
        dependencies: trace.dependencies,
      },
    ]);

    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }

    this.redoStack = [];

    return output;
  }
}

export const undoStore = new Undo(40);
export const { undoable } = undoStore;
