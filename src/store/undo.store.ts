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
  state: string[];
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

  private batch: Trace[] = [];

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

    undo.forEach((trace) => {
      loadLocalState(trace.instance, trace.state[0]);
    });

    this.redoStack.push(undo);
  }

  public redo() {
    const redo = this.redoStack.pop();

    if (!redo) {
      return;
    }

    redo.forEach((trace) => {
      loadLocalState(trace.instance, trace.state[trace.state.length - 1]);
    });

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

      if (self.tickId === self.nextTickId) {
        self.nextTickId = self.tickId + 1;
      }

      Promise.resolve().then(() => {
        if (self.tickId === self.nextTickId) {
          return;
        }

        self.tickId = self.nextTickId;

        self.pushBatch();
      });

      const trace: Trace = {
        store: target.constructor.name,
        instance: this,
        action: propertyKey,
        state: [saveLocalState(this, dependencies)],
        dependencies,
      };

      const lastUndo = self.batch.length > 0
        ? self.batch
        : self.undoStack[self.undoStack.length - 1];

      if (!saveIntermediateActions && lastUndo) {
        const matchingTrace = lastUndo.find((t) => (
          t.instance === trace.instance
          && t.action === trace.action
        ));

        if (lastUndo && matchingTrace) {
          return self.replaceLastUndoStack(trace, matchingTrace, fn.call(this, ...args));
        }
      }

      return self.pushToUndoStack(trace, fn.call(this, ...args));
    };

    return descriptor;
  };

  private pushBatch() {
    if (this.batch.length === 0) {
      return;
    }

    this.undoStack.push(this.batch);
    this.batch = [];

    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }
  }

  private replaceLastUndoStack<T = any>(trace: Trace, match: Trace, output: T): T {
    match.state.splice(1, 1, saveLocalState(trace.instance, trace.dependencies));

    return output;
  }

  private pushToUndoStack<T = any>(trace: Trace, output: T): T {
    this.batch.push({
      store: trace.store,
      instance: trace.instance,
      action: trace.action,
      state: [trace.state[0], saveLocalState(trace.instance, trace.dependencies)],
      dependencies: trace.dependencies,
    });

    this.redoStack = [];

    return output;
  }
}

export const undoStore = new Undo(40);
export const { undoable } = undoStore;
