import { CountEdge } from './data/count.edge';
import { ArrayConcatEdge } from './data/data.array-concat.edge';
import { ArrayEdge } from './data/data.array.edge';
import { BooleanEdge } from './data/data.boolean.edge';
import { NumberEdge } from './data/data.number.edge';
import { StringEdge } from './data/data.string.edge';
import { DebugLogEdge } from './debug/log.edge';
import { Edge } from './edge';
import { ElementTextEdge } from './element/element-text.edge';
import { ElementEdge } from './element/element.edge';
import { EventEdge } from './event.edge';
import { LogicEqualsEdge } from './logic/logic.equals.edge';
import { LogicGateEdge } from './logic/logic.gate.edge';
import { MathAddEdge } from './math/math.add.edge';
import { MathDivideEdge } from './math/math.divide.edge';
import { MathMultiplyEdge } from './math/math.multiply.edge';
import { MathSubtractEdge } from './math/math.subtract.edge';
import { StyleEdge } from './style.edge';

export const allEdges: (new (...args: any[]) => Edge)[] = [
  StringEdge,
  NumberEdge,
  BooleanEdge,
  MathAddEdge,
  MathSubtractEdge,
  MathMultiplyEdge,
  MathDivideEdge,
  ArrayEdge,
  ArrayConcatEdge,
  StyleEdge,
  ElementEdge,
  ElementTextEdge,
  LogicEqualsEdge,
  LogicGateEdge,
  EventEdge,
  CountEdge,
  DebugLogEdge,
];
