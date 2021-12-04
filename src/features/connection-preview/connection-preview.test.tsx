import { render } from '@testing-library/react';
import { spyOn, restoreAll } from 'nanospy';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ENV } from '../../../config/test';
import { NumberEdge } from '../../store/edges/data/data.number.edge';
import { pendingEdge } from '../../store/edges/pending';
import { EdgePosition } from '../../store/edges/position';

import { ConnectionPreviewComponent } from './connection-preview';

const test = suite('ConnectionPreviewComponent');

test.before(ENV.setup);
test.before.each(ENV.reset);
test.after.each(restoreAll);

test('returns function', () => {
  assert.type(ConnectionPreviewComponent, 'function');
});

test('renders empty component with no pending connection', () => {
  const { container } = render((
    <ConnectionPreviewComponent />
  ));

  assert.snapshot(
    container.innerHTML,
    '',
  );
});

test('renders component with pending connection', () => {
  spyOn(console, 'error', () => { });

  const position = new EdgePosition();
  const edge = new NumberEdge(position);

  pendingEdge.setFrom('default', edge);

  const { container } = render((
    <ConnectionPreviewComponent />
  ));

  assert.snapshot(
    container.innerHTML,
    '<g class=""><path d="M0,15 C0,15 0,15 0,15" marker-end="none"></path></g>',
  );
});

test('renders component with moving pending connection', async () => {
  spyOn(console, 'error', () => { });

  const position = new EdgePosition();
  const edge = new NumberEdge(position);

  pendingEdge.setFrom('default', edge);

  const { container } = render((
    <ConnectionPreviewComponent />
  ));

  pendingEdge.position.moveTo(200, 200);

  assert.snapshot(
    container.innerHTML,
    '<g class=""><path d="M0,15 C0,115 100,215 200,215" marker-end="none"></path></g>',
  );

  // Wait for React to finish its' rendering cycle
  await new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

  pendingEdge.position.moveTo(-543, 123);

  assert.snapshot(
    container.innerHTML,
    '<g class=""><path d="M0,15 C0,76.5 -814.5,138 -543,138" marker-end="none"></path></g>',
  );
});

test.run();
