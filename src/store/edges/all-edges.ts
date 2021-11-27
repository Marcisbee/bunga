import { BooleanEdge } from './boolean.edge';
import { Edge } from './edge';
import { ElementTextEdge } from './element-text.edge';
import { ElementEdge } from './element.edge';
import { MathAddEdge } from './math-add.edge';
import { MathDivideEdge } from './math-divide.edge';
import { MathMultiplyEdge } from './math-multiply.edge';
import { MathSubtractEdge } from './math-subtract.edge';
import { NumberEdge } from './number.edge';
import { StyleEdge } from './style.edge';
import { SwitchEdge } from './switch.edge';
import { TextEdge } from './text.edge';

export const allEdges: typeof Edge[] = [
  TextEdge,
  NumberEdge,
  BooleanEdge,
  MathAddEdge,
  MathSubtractEdge,
  MathMultiplyEdge,
  MathDivideEdge,
  StyleEdge,
  ElementEdge,
  ElementTextEdge,
  SwitchEdge,
];
