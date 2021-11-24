import type { Page, Locator } from '@playwright/test';
import { test, expect } from '@playwright/test';
import { performance } from 'perf_hooks';

async function addEdge(selector: Locator, times: number) {
  for (let i = 0; i < times; i++) {
    await selector.click();
  }
}

async function selectAllEdges(selector: Locator) {
  const handles = await selector.elementHandles();

  for (const handle of handles) {
    await handle.click({
      modifiers: ['Shift'],
    });
  }
}

async function moveMouseBy(page: Page, by: number) {
  await page.mouse.down();
  for (let i = 0; i < by; i++) {
    await page.mouse.move(500 + i, 500 + i);
  }
  await page.mouse.up();
}

test('1 edge', async ({ page }) => {
  // Go to http://localhost:5000/space/123
  await page.goto('http://localhost:5000/space/123');

  const size = 1;

  const addStartTime = performance.now();
  await addEdge(page.locator('text=add Value'), size);
  const addedVariableEdge = performance.now() - addStartTime;

  console.log(`Adding ${size} variable edge took ${Math.round(addedVariableEdge)} ms`);

  const selectStartTime = performance.now();
  await selectAllEdges(page.locator('#canvasRoot > div > div > div > div:first-child'));
  const selectVariableEdge = performance.now() - selectStartTime;

  console.log(`Selecting ${size} variable edge took ${Math.round(selectVariableEdge)} ms`);

  const moveStartTime = performance.now();
  await moveMouseBy(page, 100);
  const moveVariableEdge = performance.now() - moveStartTime;

  console.log(`Moving ${size} variable edge took ${Math.round(moveVariableEdge)} ms`);

  expect(addedVariableEdge).toBeLessThanOrEqual(60);
  expect(selectVariableEdge).toBeLessThanOrEqual(45);
  expect(moveVariableEdge).toBeLessThanOrEqual(1670);
});

test('10 edges', async ({ page }) => {
  // Go to http://localhost:5000/space/123
  await page.goto('http://localhost:5000/space/123');

  const size = 10;

  const addStartTime = performance.now();
  await addEdge(page.locator('text=add Value'), size);
  const addedVariableEdge = performance.now() - addStartTime;

  console.log(`Adding ${size} variable edges took ${Math.round(addedVariableEdge)} ms`);

  const selectStartTime = performance.now();
  await selectAllEdges(page.locator('#canvasRoot > div > div > div > div:first-child'));
  const selectVariableEdge = performance.now() - selectStartTime;

  console.log(`Selecting ${size} variable edges took ${Math.round(selectVariableEdge)} ms`);

  const startTime = performance.now();
  await moveMouseBy(page, 100);
  const moveVariableEdge = performance.now() - startTime;

  console.log(`Moving ${size} variable edges took ${Math.round(moveVariableEdge)} ms`);

  expect(addedVariableEdge).toBeLessThanOrEqual(350);
  expect(selectVariableEdge).toBeLessThanOrEqual(370);
  expect(moveVariableEdge).toBeLessThanOrEqual(1670);
});

test('50 edges', async ({ page }) => {
  // Go to http://localhost:5000/space/123
  await page.goto('http://localhost:5000/space/123');

  const size = 50;

  const addStartTime = performance.now();
  await addEdge(page.locator('text=add Value'), size);
  const addedVariableEdge = performance.now() - addStartTime;

  console.log(`Adding ${size} variable edges took ${Math.round(addedVariableEdge)} ms`);

  const selectStartTime = performance.now();
  await selectAllEdges(page.locator('#canvasRoot > div > div > div > div:first-child'));
  const selectVariableEdge = performance.now() - selectStartTime;

  console.log(`Selecting ${size} variable edges took ${Math.round(selectVariableEdge)} ms`);

  const startTime = performance.now();
  await moveMouseBy(page, 100);
  const moveVariableEdge = performance.now() - startTime;

  console.log(`Moving ${size} variable edges took ${Math.round(moveVariableEdge)} ms`);

  expect(addedVariableEdge).toBeLessThanOrEqual(1700);
  expect(selectVariableEdge).toBeLessThanOrEqual(1700);
  expect(moveVariableEdge).toBeLessThanOrEqual(1680);
});

test('100 edges', async ({ page }) => {
  // Go to http://localhost:5000/space/123
  await page.goto('http://localhost:5000/space/123');

  const size = 100;

  const addStartTime = performance.now();
  await addEdge(page.locator('text=add Value'), size);
  const addedVariableEdge = performance.now() - addStartTime;

  console.log(`Adding ${size} variable edges took ${Math.round(addedVariableEdge)} ms`);

  const selectStartTime = performance.now();
  await selectAllEdges(page.locator('#canvasRoot > div > div > div > div:first-child'));
  const selectVariableEdge = performance.now() - selectStartTime;

  console.log(`Selecting ${size} variable edges took ${Math.round(selectVariableEdge)} ms`);

  const startTime = performance.now();
  await moveMouseBy(page, 100);
  const moveVariableEdge = performance.now() - startTime;

  console.log(`Moving ${size} variable edges took ${Math.round(moveVariableEdge)} ms`);

  expect(addedVariableEdge).toBeLessThanOrEqual(3360);
  expect(selectVariableEdge).toBeLessThanOrEqual(3370);
  expect(moveVariableEdge).toBeLessThanOrEqual(1680);
});
