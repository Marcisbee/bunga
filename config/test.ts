/* eslint-disable @typescript-eslint/ban-ts-comment */
import { parseHTML } from 'linkedom';

const { window } = parseHTML('<body></body>');

function setup() {
  // @ts-ignore
  global.window = window;
  global.document = window.document;
  global.navigator = window.navigator;
  global.getComputedStyle = window.getComputedStyle;
  // @ts-ignore
  global.requestAnimationFrame = null;
}

function reset() {
  window.document.title = '';
  window.document.head.innerHTML = '';
  window.document.body.innerHTML = '<main></main>';
}

export const ENV = {
  setup,
  reset,
};
