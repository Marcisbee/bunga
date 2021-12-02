import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestScheduler } from 'rxjs/testing';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ENV } from '../../../../config/test';
import { Edge } from '../edge';

import { BooleanEdge } from './data.boolean.edge';

const test = suite('BooleanEdge');

let scheduler: TestScheduler;

test.before(ENV.setup);
test.before.each(ENV.reset);

test.before.each(() => {
  scheduler = new TestScheduler((actual, expected) => {
    assert.equal(actual, expected);
  });
});

test('BooleanEdge is function', () => {
  assert.type(BooleanEdge, 'function');
});

test('BooleanEdge is instance of Edge', () => {
  assert.instance(BooleanEdge.prototype, Edge);
});

test('can evaluate `value: undefined`', () => {
  const instance = new BooleanEdge(null as any);

  scheduler.run(({ expectObservable }) => {
    expectObservable(instance.select.default).toBe('a', { a: false });
  });
});

test('can evaluate `value: false`', () => {
  const instance = new BooleanEdge(null as any);

  instance.input.value.next(false);

  scheduler.run(({ expectObservable }) => {
    expectObservable(instance.select.default).toBe('a', { a: false });
  });
});

test('can evaluate `value: true`', () => {
  const instance = new BooleanEdge(null as any);

  instance.input.value.next(true);

  scheduler.run(({ expectObservable }) => {
    expectObservable(instance.select.default).toBe('a', { a: true });
  });
});

test('renders custom control correctly `value: null`', () => {
  const instance = new BooleanEdge(null as any);

  const { container } = render((
    instance.customControls.value()
  ));

  const element = container.querySelector('input');

  assert.ok(element);
  assert.equal(element!.checked, false);
});

test('renders custom control correctly `value: false`', () => {
  const instance = new BooleanEdge(null as any);

  instance.input.value.next(false);

  const { container } = render((
    instance.customControls.value()
  ));

  const element = container.querySelector('input');

  assert.ok(element);
  assert.equal(element!.checked, false);
});

test('renders custom control correctly `value: true`', () => {
  const instance = new BooleanEdge(null as any);

  instance.input.value.next(true);

  const { container } = render((
    instance.customControls.value()
  ));

  const element = container.querySelector('input');

  assert.ok(element);
  assert.equal(element!.checked, true);
});

test('updates input value from custom control correctly', () => {
  const instance = new BooleanEdge(null as any);

  const { container } = render((
    instance.customControls.value()
  ));

  const element = container.querySelector('input');

  assert.ok(element);

  userEvent.click(element!);

  assert.equal(instance.input.value.value, true);

  scheduler.run(({ expectObservable }) => {
    expectObservable(instance.select.default).toBe('a', { a: true });
  });
});

test.run();
