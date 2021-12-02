import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { spyOn, restoreAll } from 'nanospy';
import { TestScheduler } from 'rxjs/testing';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ENV } from '../../../../config/test';
import { Edge } from '../edge';

import { NumberEdge } from './data.number.edge';

const test = suite('NumberEdge');

let scheduler: TestScheduler;

test.before(ENV.setup);
test.before.each(ENV.reset);
test.after.each(restoreAll);

test.before.each(() => {
  scheduler = new TestScheduler((actual, expected) => {
    assert.equal(actual, expected);
  });
});

test('NumberEdge is function', () => {
  assert.type(NumberEdge, 'function');
});

test('NumberEdge is instance of Edge', () => {
  assert.instance(NumberEdge.prototype, Edge);
});

test('can evaluate `value: undefined`', () => {
  const instance = new NumberEdge(null as any);

  scheduler.run(({ expectObservable }) => {
    expectObservable(instance.select.default).toBe('a', { a: undefined });
  });
});

test('can evaluate `value: 0`', () => {
  const instance = new NumberEdge(null as any);

  instance.input.value.next(0);

  scheduler.run(({ expectObservable }) => {
    expectObservable(instance.select.default).toBe('a', { a: 0 });
  });
});

test('can evaluate `value: 15`', () => {
  const instance = new NumberEdge(null as any);

  instance.input.value.next(15);

  scheduler.run(({ expectObservable }) => {
    expectObservable(instance.select.default).toBe('a', { a: 15 });
  });
});

test('renders custom control correctly `value: null`', () => {
  const instance = new NumberEdge(null as any);

  const { container } = render((
    instance.customControls.value()
  ));

  const element = container.querySelector('input');

  assert.ok(element);
  assert.equal(element!.value, '');
});

test('renders custom control correctly `value: undefined`', () => {
  const instance = new NumberEdge(null as any);

  instance.input.value.next(undefined);

  const { container } = render((
    instance.customControls.value()
  ));

  const element = container.querySelector('input');

  assert.ok(element);
  assert.equal(element!.value, '');
});

test('renders custom control correctly `value: 15`', () => {
  const instance = new NumberEdge(null as any);

  instance.input.value.next(15);

  const { container } = render((
    instance.customControls.value()
  ));

  const element = container.querySelector('input');

  assert.ok(element);
  assert.equal(element!.value, '15');
});

test('updates input value from custom control correctly', () => {
  // Silence TypeError: activeElement.attachEvent is not a function
  spyOn(console, 'error', () => {});

  const instance = new NumberEdge(null as any);

  const { container } = render((
    instance.customControls.value()
  ));

  const element = container.querySelector('input');

  assert.ok(element);

  userEvent.type(element!, '1337');

  assert.equal(instance.input.value.value, 1337);

  scheduler.run(({ expectObservable }) => {
    expectObservable(instance.select.default).toBe('a', { a: 1337 });
  });
});

test.run();
