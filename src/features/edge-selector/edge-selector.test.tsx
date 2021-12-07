import { render } from '@testing-library/react';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ENV } from '../../../config/test';

import { EdgeSelectorComponent } from './edge-selector';

const test = suite('EdgeSelectorComponent');

test.before(ENV.setup);
test.before.each(ENV.reset);

test('returns function', () => {
  assert.type(EdgeSelectorComponent, 'function');
});

test('renders inactive component correctly', () => {
  const { container } = render((
    <EdgeSelectorComponent />
  ));

  assert.snapshot(
    container.innerHTML,
    '<div><div><button type="button" class=""><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"></path></svg></button></div></div>',
  );
});

test('renders input when button clicked', () => {
  const { container } = render((
    <EdgeSelectorComponent />
  ));

  container.querySelector('button')!.click();

  const input = container.querySelector('input')!;

  assert.ok(input);
});

test.run();
