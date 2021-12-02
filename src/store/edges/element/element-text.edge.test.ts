import { TestScheduler } from 'rxjs/testing';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { NumberEdge } from '../data/data.number.edge';
import { Edge } from '../edge';

import { ElementTextEdge } from './element-text.edge';

const test = suite('ElementTextEdge');

let scheduler: TestScheduler;

test.before.each(() => {
  scheduler = new TestScheduler((actual, expected) => {
    assert.equal(actual, expected);
  });
});

test('ElementTextEdge is function', () => {
  assert.type(ElementTextEdge, 'function');
});

test('ElementTextEdge is instance of Edge', () => {
  assert.instance(ElementTextEdge.prototype, Edge);
});

test('can evaluate `text: null`', async () => {
  const instance = new ElementTextEdge(null as any);

  scheduler.run(({ expectObservable }) => {
    expectObservable(instance.select.default).toBe('a', { a: null });
  });
});

test('can evaluate `text: NumberEdge (undefined)`', async () => {
  const input = new NumberEdge(null as any);
  const instance = new ElementTextEdge(null as any);

  input.output.default.connect('text', instance);

  scheduler.run(({ expectObservable }) => {
    expectObservable(instance.select.default).toBe('a', { a: undefined });
  });
});

test('can evaluate `text: NumberEdge (15)`', async () => {
  const input = new NumberEdge(null as any);
  const instance = new ElementTextEdge(null as any);

  input.input.value.next(15);

  input.output.default.connect('text', instance);

  scheduler.run(({ expectObservable }) => {
    expectObservable(instance.select.default).toBe('a', { a: 15 });
  });
});

test.run();
