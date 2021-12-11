import { render } from '@testing-library/react';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ENV } from '../../../config/test';

import { CanvasToolsComponent } from './canvas-tools';

const test = suite('CanvasToolsComponent');

test.before(ENV.setup);
test.before.each(ENV.reset);

test('returns function', () => {
  assert.type(CanvasToolsComponent, 'function');
});

test('renders component correctly', () => {
  const { container } = render((
    <CanvasToolsComponent />
  ));

  const icons = container.querySelectorAll('svg');

  assert.is(icons.length, 6);
});

test.run();
