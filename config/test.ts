/* eslint-disable @typescript-eslint/ban-ts-comment */
import { JSDOM } from 'jsdom';
import { Spy, spyOn } from 'nanospy';
// import { parseHTML } from 'linkedom';

const { window } = new JSDOM();
// Linkedom has some issues with user events.
// const { window } = parseHTML('<body></body>');

let fetchSpy: Spy;

function setup() {
  // @ts-ignore
  global.window = window;
  global.document = window.document;
  global.navigator = window.navigator;
  global.getComputedStyle = window.getComputedStyle;
  // @ts-ignore
  global.requestAnimationFrame = null;

  fetchSpy = spyOn(global, 'fetch', async () => ({
    ok: false,
  } as Response));
}

function reset() {
  window.document.title = '';
  window.document.head.innerHTML = '';
  window.document.body.innerHTML = '';

  fetchSpy.restore();
}

export const ENV = {
  setup,
  reset,
};
