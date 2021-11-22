import { Edge } from './edge';
import { ElementTextEdge } from './element-text.edge';
import { ElementEdge } from './element.edge';
import { MathAddEdge } from './math-add.edge';
import { StyleEdge } from './style.edge';
import { VariableEdge } from './variable.edge';

export const allEdges: typeof Edge[] = [
  VariableEdge,
  MathAddEdge,
  StyleEdge,
  ElementEdge,
  ElementTextEdge,
];
