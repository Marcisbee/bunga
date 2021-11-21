import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { Edge } from './edge';
import { ElementTextEdge } from './element-text.edge';
import { VariableEdge } from './variable.edge';

const test = suite('ElementTextEdge');

test('ElementTextEdge is function', () => {
  assert.type(ElementTextEdge, 'function');
});

test('ElementTextEdge is instance of Edge', () => {
  assert.instance(ElementTextEdge.prototype, Edge);
});

test('can evaluate `text: null` input', async () => {
  const instance = new ElementTextEdge(null as any);

  assert.equal(await instance.evaluate(), {
    default: '',
  });
});

test('can evaluate `text: VariableEdge (undefined)` input', async () => {
  const input = new VariableEdge(null as any);
  const instance = new ElementTextEdge(null as any);

  input.output.default.connect('text', instance);

  assert.equal(await instance.evaluate(), {
    default: '',
  });
});

test('can evaluate `text: VariableEdge (15)` input', async () => {
  const input = new VariableEdge(null as any);
  const instance = new ElementTextEdge(null as any);

  input.input.value = 15;

  input.output.default.connect('text', instance);

  assert.equal(await instance.evaluate(), {
    default: '15',
  });
});

test.run();
