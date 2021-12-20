import { flattie } from 'flattie';

import { CountEdge } from './data/count.edge';
import { ArrayConcatEdge } from './data/data.array-concat.edge';
import { ArrayEdge } from './data/data.array.edge';
import { BooleanEdge } from './data/data.boolean.edge';
import { NumberEdge } from './data/data.number.edge';
import { StringEdge } from './data/data.string.edge';
import { ToggleEdge } from './data/toggle.edge';
import { DebugLogEdge } from './debug/log.edge';
import { Edge } from './edge';
import { ElementTextEdge } from './element/element-text.edge';
import { ElementEdge } from './element/element.edge';
import { MouseEventEdge } from './event/event.mouse.edge';
import { LogicAndEdge } from './logic/logic.and.edge';
import { LogicEqualsEdge } from './logic/logic.equals.edge';
import { LogicGateEdge } from './logic/logic.gate.edge';
import { LogicGreaterThanEdge } from './logic/logic.gt.edge';
import { LogicGreaterThanOrEqualEdge } from './logic/logic.gte.edge';
import { LogicLessThanEdge } from './logic/logic.lt.edge';
import { LogicLessThanOrEqualEdge } from './logic/logic.lte.edge';
import { LogicNotEdge } from './logic/logic.not.edge';
import { LogicOrEdge } from './logic/logic.or.edge';
import { MathAddEdge } from './math/math.add.edge';
import { MathDivideEdge } from './math/math.divide.edge';
import { MathMultiplyEdge } from './math/math.multiply.edge';
import { MathSubtractEdge } from './math/math.subtract.edge';
import { StyleEdge } from './style.edge';

export type EdgeConstructor = new (...args: any[]) => Edge;

export const edgeGroups: Record<string, Record<string, EdgeConstructor>> = {
  data: {
    string: StringEdge,
    number: NumberEdge,
    boolean: BooleanEdge,
    array: ArrayEdge,
  },
  template: {
    element: ElementEdge,
    text: ElementTextEdge,
  },
  style: {
    style: StyleEdge,
  },
  event: {
    mouse: MouseEventEdge,
  },
  state: {
    count: CountEdge,
    toggle: ToggleEdge,
  },
  math: {
    add: MathAddEdge,
    subtract: MathSubtractEdge,
    multiply: MathMultiplyEdge,
    divide: MathDivideEdge,
  },
  logic: {
    equals: LogicEqualsEdge,
    greaterThan: LogicGreaterThanEdge,
    greaterThanOrEqual: LogicGreaterThanOrEqualEdge,
    lessThan: LogicLessThanEdge,
    lessThanOrEqual: LogicLessThanOrEqualEdge,
    and: LogicAndEdge,
    or: LogicOrEdge,
    not: LogicNotEdge,
    gate: LogicGateEdge,
  },
  utility: {
    arrayConcat: ArrayConcatEdge,
  },
  debug: {
    log: DebugLogEdge,
  },
};

export const allEdges: EdgeConstructor[] = ([] as EdgeConstructor[])
  .concat(...Object.values(flattie<Record<string, EdgeConstructor[]>>(edgeGroups)));
