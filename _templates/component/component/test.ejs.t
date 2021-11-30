---
to: src/components/<%= h.changeCase.paramCase(name) %>/<%= h.changeCase.paramCase(name) %>.test.tsx
---
<% camelized = h.changeCase.pascal(name) -%>
import { render } from '@testing-library/react';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import * as ENV from '../../../config/test';

import { <%= camelized %> } from './<%= h.changeCase.paramCase(name) %>';

const test = suite('<%= camelized %>');

test.before(ENV.setup);
test.before.each(ENV.reset);

test('returns function', () => {
  assert.type(<%= camelized %>, 'function');
});

test('renders component correctly', () => {
  const { container } = render((
    <<%= camelized %> />
  ));

  assert.snapshot(
    container.innerHTML,
    '<div><%= camelized %></div>',
  );
});

test.run();
