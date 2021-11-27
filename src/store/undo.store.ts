import { Exome, loadState, saveState } from 'exome';

interface Trace {
  store: string;
  instance: Exome;
  action: string;
  state: string;
}

class Undo extends Exome {
  private undoStack: Trace[] = [];

  private redoStack: Trace[] = [];

  public get canUndo() {
    return this.undoStack.length > 0;
  }

  public get canRedo() {
    return this.redoStack.length > 1;
  }

  constructor(
    private maxSize = 30,
  ) {
    super();
  }

  public undo() {
    const undo = this.undoStack.pop();

    if (!undo) {
      return;
    }

    loadState(undo.instance, undo.state);

    this.redoStack.push(undo);
  }

  public redo() {
    const redo = this.redoStack.pop();
    const next = this.redoStack[this.redoStack.length - 1];

    if (!redo || !next) {
      return;
    }

    loadState(next.instance, next.state);

    this.undoStack.push(redo);
  }

  public clear() {
    this.undoStack = [];
    this.redoStack = [];
  }

  public undoable(
    target: Exome,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const fn = descriptor.value!;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = function value(...args: any[]) {
      if (!(this instanceof Exome)) {
        return;
      }

      const trace = {
        store: target.constructor.name,
        instance: this,
        action: propertyKey,
        state: saveState(this),
      };

      // eslint-disable-next-line consistent-return
      return self.pushToUndoStack(trace, fn.call(this, ...args));
    };

    return descriptor;
  }

  private pushToUndoStack<T = any>(trace: any, output: T): T {
    this.undoStack.push(trace);

    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }

    this.redoStack = [
      {
        store: trace.store,
        instance: trace.instance,
        action: trace.action,
        state: saveState(trace.instance),
      },
    ];

    return output;
  }
}

export const undoStore = new Undo(40);
export const { undoable } = undoStore;
