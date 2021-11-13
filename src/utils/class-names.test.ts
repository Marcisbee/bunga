import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { cc } from './class-names';

const test = suite('class names');

test('cc is function', () => {
  assert.type(cc, 'function');
});

const tests: [string, any[]][] = [
  ['', []],
  ['', [undefined]],
  ['', [null]],
  ['', [false]],
  ['1', [1]],
  ['0', [0]],
  ['', ['']],
  ['active', ['active']],
  ['foo bar baz', ['foo', 'bar', 'baz']],
  ['foo baz', ['foo', false, 'baz']],
  ['foo baz', ['foo', '', 'baz']],
];

for (const [expectation, input] of tests) {
  test(`returns ${JSON.stringify(expectation)} with input ${JSON.stringify(input)}`, () => {
    assert.is(cc(input), expectation);
  });
}

test.run();
