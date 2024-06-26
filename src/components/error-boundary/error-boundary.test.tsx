import { render } from '@testing-library/react';
import { spyOn, restoreAll } from 'nanospy';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ENV } from '../../../config/test';

import { ErrorBoundary } from './error-boundary';

const test = suite('ErrorBoundary');

test.before(ENV.setup);
test.before.each(ENV.reset);
test.after.each(restoreAll);

test('returns function', () => {
  assert.type(ErrorBoundary, 'function');
});

test('renders component correctly', () => {
  const { container } = render((
    <ErrorBoundary />
  ));

  assert.snapshot(
    container.innerHTML,
    '',
  );
});

test('renders children correctly', () => {
  const { container } = render((
    <ErrorBoundary>
      1
      2
      3
    </ErrorBoundary>
  ));

  assert.snapshot(
    container.innerHTML,
    '1 2 3',
  );
});

test('renders error correctly', () => {
  spyOn(console, 'error', () => {});

  const ErrorComponent = () => {
    const error = new Error('Foo: Error message');
    error.stack = 'Foo: Error message\nERROR Stack';

    throw error;
  };

  const { container } = render((
    <ErrorBoundary>
      1
      <ErrorComponent />
      3
    </ErrorBoundary>
  ));

  assert.snapshot(
    container.innerHTML,
    '<div class=""><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1l-12 22h24l-12-22zm-1 8h2v7h-2v-7zm1 11.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"></path></svg><h3>Something went wrong.</h3><pre>Foo: Error message</pre></div>',
  );
});

test.run();
