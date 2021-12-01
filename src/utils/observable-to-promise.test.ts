import { BehaviorSubject, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { observableToPromise } from './observable-to-promise';

const test = suite('observableToPromise');

let scheduler: TestScheduler;

test.before.each(() => {
  scheduler = new TestScheduler((actual, expected) => {
    assert.equal(actual, expected);
  });
});

test('observableToPromise is function', () => {
  assert.type(observableToPromise, 'function');
});

test('returns promise from BehaviorSubject', async () => {
  const input = new BehaviorSubject(123);

  const output = observableToPromise(input);

  assert.instance(output, Promise);
  assert.is(await output, 123);
});

test('returns promise from Observable', async () => {
  const input = of('abc');

  const output = observableToPromise(input);

  assert.instance(output, Promise);
  assert.is(await output, 'abc');
});

test('returns promise from timed Observable', async () => {
  let output!: Promise<string>;

  scheduler.run(({ expectObservable, cold }) => {
    const input = cold('--a|', { a: 'def' });

    output = observableToPromise(input);

    expectObservable(input).toBe('--a|', { a: 'def' });
  });

  assert.instance(output, Promise);
  assert.is(await output, 'def');
});

test.run();
