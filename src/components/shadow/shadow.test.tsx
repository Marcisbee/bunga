import { render } from '@testing-library/react';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ENV } from '../../../config/test';

import { ShadowView } from './shadow.component';

const test = suite('ShadowView');

test.before(ENV.setup);
test.before.each(ENV.reset);

test('returns function', () => {
  assert.type(ShadowView, 'function');
});

test('renders component correctly', () => {
  const { container } = render((
    <ShadowView>
      Hello test
    </ShadowView>
  ));

  // Linkedom doesn't support shadow DOM, hence it's empty.
  // Revisit this when it's supported.
  assert.snapshot(
    container.innerHTML,
    '<div></div>',
  );
});

test.run();
