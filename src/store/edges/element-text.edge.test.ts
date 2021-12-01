import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { observableToPromise } from '../../utils/observable-to-promise';

import { NumberEdge } from './data/data.number.edge';
import { Edge } from './edge';
import { ElementTextEdge } from './element-text.edge';

const test = suite('ElementTextEdge');

test('ElementTextEdge is function', () => {
  assert.type(ElementTextEdge, 'function');
});

test('ElementTextEdge is instance of Edge', () => {
  assert.instance(ElementTextEdge.prototype, Edge);
});

test('can evaluate `text: null` input', async () => {
  const instance = new ElementTextEdge(null as any);

  assert.equal(instance.selectInput('text')!, undefined);
});

test('can evaluate `text: NumberEdge (undefined)` input', async () => {
  const input = new NumberEdge(null as any);
  const instance = new ElementTextEdge(null as any);

  input.output.default.connect('text', instance);

  assert.equal(await observableToPromise(instance.selectInput('text')!), undefined);
});

test('can evaluate `text: NumberEdge (15)` input', async () => {
  const input = new NumberEdge(null as any);
  const instance = new ElementTextEdge(null as any);

  input.input.value.next(15);

  input.output.default.connect('text', instance);

  assert.equal(await observableToPromise(instance.selectInput('text')!), 15);
});

test.run();
