import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { spyOn, restoreAll } from 'nanospy';
import { TestScheduler } from 'rxjs/testing';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ENV } from '../../../../config/test';
import { Edge } from '../edge';

import { StringEdge } from './data.string.edge';

const test = suite('StringEdge');

let scheduler: TestScheduler;

test.before(ENV.setup);
test.before.each(ENV.reset);
test.after.each(restoreAll);

test.before.each(() => {
  scheduler = new TestScheduler((actual, expected) => {
    assert.equal(actual, expected);
  });
});

test('StringEdge is function', () => {
  assert.type(StringEdge, 'function');
});

test('StringEdge is instance of Edge', () => {
  assert.instance(StringEdge.prototype, Edge);
});

test('can evaluate `value: undefined`', () => {
  const instance = new StringEdge(null as any);

  scheduler.run(({ expectObservable }) => {
    expectObservable(instance.select.default).toBe('a', { a: undefined });
  });
});

test('can evaluate `value: ""`', () => {
  const instance = new StringEdge(null as any);

  instance.input.value.next('');

  scheduler.run(({ expectObservable }) => {
    expectObservable(instance.select.default).toBe('a', { a: '' });
  });
});

test('can evaluate `value: "foo"`', () => {
  const instance = new StringEdge(null as any);

  instance.input.value.next('test');

  scheduler.run(({ expectObservable }) => {
    expectObservable(instance.select.default).toBe('a', { a: 'test' });
  });
});

test('renders custom control correctly `value: null`', () => {
  const instance = new StringEdge(null as any);

  const { container } = render((
    instance.customControls.value()
  ));

  const element = container.querySelector('input');

  assert.ok(element);
  assert.equal(element!.value, '');
});

test('renders custom control correctly `value: undefined`', () => {
  const instance = new StringEdge(null as any);

  instance.input.value.next(undefined);

  const { container } = render((
    instance.customControls.value()
  ));

  const element = container.querySelector('input');

  assert.ok(element);
  assert.equal(element!.value, '');
});

test('renders custom control correctly `value: "test"`', () => {
  const instance = new StringEdge(null as any);

  instance.input.value.next('test');

  const { container } = render((
    instance.customControls.value()
  ));

  const element = container.querySelector('input');

  assert.ok(element);
  assert.equal(element!.value, 'test');
});

test('updates input value from custom control correctly', () => {
  // Silence TypeError: activeElement.attachEvent is not a function
  spyOn(console, 'error', () => {});

  const instance = new StringEdge(null as any);

  const { container } = render((
    instance.customControls.value()
  ));

  const element = container.querySelector('input');

  assert.ok(element);

  userEvent.type(element!, 'test2');

  assert.equal(instance.input.value.value, 'test2');

  scheduler.run(({ expectObservable }) => {
    expectObservable(instance.select.default).toBe('a', { a: 'test2' });
  });
});

test.run();
