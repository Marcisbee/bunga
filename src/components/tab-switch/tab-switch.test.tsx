import { render } from '@testing-library/react';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ENV } from '../../../config/test';

import { TabSwitchComponent } from './tab-switch';

const test = suite('TabSwitchComponent');

test.before(ENV.setup);
test.before.each(ENV.reset);

test('returns function', () => {
  assert.type(TabSwitchComponent, 'function');
});

test('renders component correctly', () => {
  const { container } = render((
    <TabSwitchComponent
      value="first"
      options={[
        'first',
        'second',
      ]}
      render={{
        first: 'FIRST',
        second: 'SECOND',
      }}
    />
  ));

  assert.snapshot(
    container.innerHTML,
    '<div><div><button type="button">first</button><button type="button" class="">second</button></div><div>FIRST</div></div>',
  );
});

test('renders second correctly when clicked on second tab', () => {
  const { container } = render((
    <TabSwitchComponent
      value="first"
      options={[
        'first',
        'second',
      ]}
      render={{
        first: 'FIRST',
        second: 'SECOND',
      }}
    />
  ));

  const secondTab = container.querySelectorAll('button')[1]!;

  secondTab.click();

  assert.snapshot(
    container.innerHTML,
    '<div><div><button type="button" class="">first</button><button type="button">second</button></div><div>SECOND</div></div>',
  );
});

test.run();
