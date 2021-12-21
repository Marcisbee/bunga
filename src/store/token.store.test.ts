import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { defaultTokens, TokenStore } from './token.store';

const test = suite('TokenStore');

test('default value of store', () => {
  const expected = {
    name: 'test',
    tokens: '--primary-color: red;',
    id: 'id000',
  };

  const store = new TokenStore('test', undefined, 'id000');

  assert.snapshot(
    JSON.stringify(store, null, 2),
    JSON.stringify(expected, null, 2),
  );
});

test('sets name', () => {
  const expected = {
    name: 'New Name',
    tokens: defaultTokens,
    id: 'id000',
  };

  const store = new TokenStore('test', undefined, 'id000');

  const output = store.setName('New Name');

  assert.is(output, undefined);
  assert.snapshot(
    JSON.stringify(store, null, 2),
    JSON.stringify(expected, null, 2),
  );
});

test('sets tokens', () => {
  const expected = {
    name: 'test',
    tokens: '--primary-color: orange;',
    id: 'id000',
  };

  const store = new TokenStore('test', undefined, 'id000');

  const output = store.setTokens(expected.tokens);

  assert.is(output, undefined);
  assert.snapshot(
    JSON.stringify(store, null, 2),
    JSON.stringify(expected, null, 2),
  );
});

test.run();
