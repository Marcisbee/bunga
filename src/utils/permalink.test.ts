import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { permalink } from './permalink';

const test = suite('permalink');

test('permalink is function', () => {
  assert.type(permalink, 'function');
});

const tests = [
  ['', ''],
  ['', '-'],
  ['', '     '],
  ['', '   -  '],
  ['0', '0'],
  ['1', '1'],
  ['1234567890', '1234567890'],
  ['start', 'start'],
  ['start', 'Start'],
  ['hello-world', 'Hello world'],
  ['foo-and-bar', 'Foo&Bar'],
  ['foo-and-bar', 'Foo _&-     bar'],
  ['foo-bar-baz', '  _ foo---BAR- _  baZ---_'],
  ['foo-bar', ' ~!@#$%^*foo()+/-+?>·,<:";\'{}[]\|`bar'],
  ['screen0', 'Screen0'],
  ['screen-1', 'Screen 1'],
  ['hello-world', 'HELLO_WORLD'],
  ['foo-bar', 'foo–bar'],
  ['loti-personala-informacija', 'Ļoti Personāla Informācija'],
  ['ganz-perseinlech-informatioun', 'Ganz Perséinlech Informatioun'],
  ['velmi-osobni-informace', 'Velmi Osobní Informace'],
  ['personliche-angaben', 'Persönliche Angaben'],
  ['xarmolyph-agaph', 'χαρμολύπη αγάπη'],
  ['tres', 'très'],
  ['hello-tab', 'hello\ttab'],
  ['hello-newline', 'hello\n\rnewline'],
  ['a-b', 'a\f\v b'],
];

for (const [expectation, input] of tests) {
  test(`returns ${JSON.stringify(expectation)} with input ${JSON.stringify(input)}`, () => {
    assert.is(permalink(input), expectation);
  });
}

test.run();
