import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
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

test('renders component correctly', async () => {
  const { container } = render((
    <Suspense fallback="Loading">
      <ProjectsListComponent />
    </Suspense>
  ));

  await waitFor(() => {
    assert.snapshot(
      container.innerHTML,
      '<div><div>No projects</div></div>',
    );
  });
});

test.run();
