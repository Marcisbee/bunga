import { Edge } from './edge';
import { ElementTextEdge } from './element-text.edge';
import { ElementEdge } from './element.edge';
import { MathAddEdge } from './math-add.edge';
import { StyleEdge } from './style.edge';
import { NumberEdge } from './number.edge';
import { TextEdge } from './text.edge';
import { BooleanEdge } from './boolean.edge';
import { MathSubtractEdge } from './math-subtract.edge';
import { MathMultiplyEdge } from './math-multiply.edge';
import { MathDivideEdge } from './math-divide.edge';

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
];
