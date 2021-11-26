import { Edge } from './edge';
import { ElementTextEdge } from './element-text.edge';
import { ElementEdge } from './element.edge';
import { MathAddEdge } from './math-add.edge';
import { StyleEdge } from './style.edge';
import { NumberEdge } from './number.edge';
import { BooleanEdge } from './boolean.edge';

export const allEdges: typeof Edge[] = [
  NumberEdge,
  BooleanEdge,
  MathAddEdge,
  StyleEdge,
  ElementEdge,
  ElementTextEdge,
];
