import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { PositionStore } from './position.store';

const test = suite('PositionStore');

test('default value of store', () => {
  const expected = {
    x: 0,
    y: 0,
    before: {
      x: 0,
      y: 0,
    },
  };

  const store = new PositionStore();

  assert.snapshot(
    JSON.stringify(store, null, 2),
    JSON.stringify(expected, null, 2),
  );
});

test('sets position', () => {
  const expected = {
    x: 10,
    y: 20,
    before: {
      x: 0,
      y: 0,
    },
  };

  const store = new PositionStore();

  const output = store.setPosition(10, 20);

  assert.is(output, undefined);
  assert.snapshot(
    JSON.stringify(store, null, 2),
    JSON.stringify(expected, null, 2),
  );
});

test('sets second position', () => {
  const expected = {
    x: 45,
    y: 95,
    before: {
      x: 10,
      y: 20,
    },
  };

  const store = new PositionStore();
  store.setPosition(10, 20);

  const output = store.setPosition(45, 95);

  assert.is(output, undefined);
  assert.snapshot(
    JSON.stringify(store, null, 2),
    JSON.stringify(expected, null, 2),
  );
});

test('resets position', async () => {
  const expected = {
    x: 0,
    y: 0,
    before: {
      x: 45,
      y: 95,
    },
  };

  const store = new PositionStore();

  store.setPosition(10, 20);
  store.setPosition(45, 95);

  const output = store.resetPosition();

  assert.instance(output, Promise);
  assert.is(await output, undefined);
  assert.snapshot(
    JSON.stringify(store, null, 2),
    JSON.stringify(expected, null, 2),
  );
});

test.run();
