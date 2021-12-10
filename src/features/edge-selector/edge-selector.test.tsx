import { render } from '@testing-library/react';
import { spyOn, restoreAll } from 'nanospy';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ENV } from '../../../config/test';

import { EdgeSelectorComponent } from './edge-selector';

const test = suite('EdgeSelectorComponent');

test.before(ENV.setup);
test.before.each(ENV.reset);
test.after.each(restoreAll);

test('returns function', () => {
  assert.type(EdgeSelectorComponent, 'function');
});

test('renders input correctly', () => {
  spyOn(console, 'error', () => { });

  const { container } = render((
    <EdgeSelectorComponent onClose={() => {}} />
  ));

  container.querySelector('button')!.click();

  const input = container.querySelector('input')!;

  assert.ok(input);
});

test.run();
