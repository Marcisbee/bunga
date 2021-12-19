import { render } from '@testing-library/react';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ENV } from '../../../config/test';

import { ProjectsListComponent } from './projects-list';

const test = suite('ProjectsListComponent');

test.before(ENV.setup);
test.before.each(ENV.reset);

test('returns function', () => {
  assert.type(ProjectsListComponent, 'function');
});

test('renders component correctly', () => {
  const { container } = render((
    <ProjectsListComponent />
  ));

  assert.snapshot(
    container.innerHTML,
    '<div>ProjectsList</div>',
  );
});

test.run();
