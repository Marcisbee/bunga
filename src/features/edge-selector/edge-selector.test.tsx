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

test('renders component correctly', () => {
  const { container } = render((
    <EdgeSelectorComponent />
  ));

  assert.snapshot(
    container.innerHTML,
    '<div>EdgeSelector</div>',
  );
});

test.run();
