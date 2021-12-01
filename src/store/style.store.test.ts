import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { defaultStyleCss, StyleStore, ActiveStyleStore } from './style.store';

const test = suite('StyleStore');

test('default value of StyleStore', () => {
  const expected = {
    name: 'test',
    css: defaultStyleCss,
  };

  const store = new StyleStore('test');

  assert.snapshot(
    JSON.stringify(store, null, 2),
    JSON.stringify(expected, null, 2),
  );
});

test('sets name', () => {
  const expected = {
    name: 'New Name',
    css: defaultStyleCss,
  };

  const store = new StyleStore('test');

  const output = store.setName('New Name');

  assert.is(output, undefined);
  assert.snapshot(
    JSON.stringify(store, null, 2),
    JSON.stringify(expected, null, 2),
  );
});

test('sets css', () => {
  const expected = {
    name: 'test',
    css: 'background: red;',
  };

  const store = new StyleStore('test');

  const output = store.setCss(expected.css);

  assert.is(output, undefined);
  assert.snapshot(
    JSON.stringify(store, null, 2),
    JSON.stringify(expected, null, 2),
  );
});

test('default value of ActiveStyleStore', () => {
  const expected = {
    active: null,
  };

  const store = new ActiveStyleStore();

  assert.snapshot(
    JSON.stringify(store, null, 2),
    JSON.stringify(expected, null, 2),
  );
});

test('sets active style', () => {
  const styleStore = new StyleStore('test');
  const store = new ActiveStyleStore();

  const output = store.setActive(styleStore);

  assert.is(output, undefined);
  assert.is(store.active, styleStore);
});

test.run();