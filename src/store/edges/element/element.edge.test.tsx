import { render } from '@testing-library/react';
import { setExomeId } from 'exome';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TestScheduler } from 'rxjs/testing';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ENV } from '../../../../config/test';
import { store } from '../../store';
import { StyleStore } from '../../style.store';
import { Edge } from '../edge';
import { StyleEdge } from '../style.edge';

import { ElementEdge } from './element.edge';

const test = suite('ElementEdge');

let scheduler: TestScheduler;

test.before(ENV.setup);
test.before.each(ENV.reset);

test.before.each(() => {
  scheduler = new TestScheduler((actual, expected) => {
    assert.equal(actual, expected);
  });
});

test('ElementEdge is function', () => {
  assert.type(ElementEdge, 'function');
});

test('ElementEdge is instance of Edge', () => {
  assert.instance(ElementEdge.prototype, Edge);
});

test('can evaluate `style: null`', () => {
  const instance = new ElementEdge(null as any);

  scheduler.run(({ expectObservable }) => {
    expectObservable(instance.select.default).toBe('a', { a: null });
  });
});

test('can evaluate `style: StyleEdge (null)`', () => {
  const input = new StyleEdge(null as any);
  const instance = new ElementEdge(null as any);

  input.output.default.connect('style', instance);

  scheduler.run(({ expectObservable }) => {
    expectObservable(instance.select.default).toBe('a', { a: null });
  });
});

test('can evaluate `style: StyleEdge (StyleStore)`', () => {
  const styleStore = new StyleStore('test');
  const input = new StyleEdge(null as any);
  const instance = new ElementEdge(null as any);

  input.input.source.next(styleStore);
  input.output.default.connect('style', instance);

  scheduler.run(({ expectObservable }) => {
    expectObservable(instance.select.default).toBe('a', { a: styleStore });
  });
});

test('renders output correctly `style: StyleEdge (null)`', () => {
  const input = new StyleEdge(null as any);
  const instance = new ElementEdge(null as any);

  setExomeId(instance, 'test');

  input.output.default.connect('style', instance);

  store.setActiveProject('test project');

  const { container } = render((
    <DndProvider backend={HTML5Backend}>
      <instance.render />
    </DndProvider>
  ));

  assert.snapshot(
    container.innerHTML,
    '<div draggable="true" role="button">'
    + '<div>'
      + '<style>'
        + '#ElementEdge-test { background-color: #ccc; }'
      + '</style>'
      + '<div id="ElementEdge-test"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>'
    + '</div>'
  + '</div>',
  );
});

test('renders output correctly `style: StyleEdge (StyleStore)`', () => {
  const styleStore = new StyleStore('test');
  const input = new StyleEdge(null as any);
  const instance = new ElementEdge(null as any);

  setExomeId(instance, 'test');

  input.input.source.next(styleStore);
  input.output.default.connect('style', instance);

  store.setActiveProject('test project');

  const { container } = render((
    <DndProvider backend={HTML5Backend}>
      <instance.render />
    </DndProvider>
  ));

  assert.snapshot(
    container.innerHTML,
    '<div draggable="true" role="button">'
    + '<div>'
      + '<style>'
        + ':host {--primary-color: red;}'
        + '#ElementEdge-test {color: white;\nbackground-color: purple;\npadding: 10px;\nborder: 0;}'
      + '</style>'
      + '<div id="ElementEdge-test"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>'
    + '</div>'
  + '</div>',
  );
});

test.run();
