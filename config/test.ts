/* eslint-disable @typescript-eslint/ban-ts-comment */
import { parseHTML } from 'linkedom';

const { window } = parseHTML('<body></body>');

export function setup() {
  // @ts-ignore
  global.window = window;
  global.document = window.document;
  global.navigator = window.navigator;
  global.getComputedStyle = window.getComputedStyle;
  // @ts-ignore
  global.requestAnimationFrame = null;
}

export function reset() {
  window.document.title = '';
  window.document.head.innerHTML = '';
  window.document.body.innerHTML = '<main></main>';
}
