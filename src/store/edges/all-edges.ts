import { Edge } from './edge';
import { ElementTextEdge } from './element-text.edge';
import { ElementEdge } from './element.edge';
import { MathAddEdge } from './math-add.edge';
import { StyleEdge } from './style.edge';
import { NumberEdge } from './number.edge';
import { TextEdge } from './text.edge';

export const allEdges: typeof Edge[] = [
  TextEdge,
  NumberEdge,
  MathAddEdge,
  StyleEdge,
  ElementEdge,
  ElementTextEdge,
];
