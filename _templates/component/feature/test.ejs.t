---
to: src/features/<%= h.changeCase.paramCase(name) %>/<%= h.changeCase.paramCase(name) %>.test.tsx
---
<% camelized = h.changeCase.pascal(name) -%>
import { render } from '@testing-library/react';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ENV } from '../../../config/test';

import { <%= camelized %>Component } from './<%= h.changeCase.paramCase(name) %>';

const test = suite('<%= camelized %>Component');

test.before(ENV.setup);
test.before.each(ENV.reset);

test('returns function', () => {
  assert.type(<%= camelized %>Component, 'function');
});

test('renders component correctly', () => {
  const { container } = render((
    <<%= camelized %>Component />
  ));

  assert.snapshot(
    container.innerHTML,
    '<div><%= camelized %></div>',
  );
});

test.run();
