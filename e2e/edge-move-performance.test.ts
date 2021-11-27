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
  // Go to http://localhost:5000/project/123
  await page.goto('http://localhost:5000/project/123');

  const size = 1;

  const addStartTime = performance.now();
  await addEdge(page.locator('text=add Number'), size);
  const addedNumberEdge = performance.now() - addStartTime;

  console.log(`Adding ${size} variable edge took ${Math.round(addedNumberEdge)} ms`);

  const selectStartTime = performance.now();
  await selectAllEdges(page.locator('#canvasRoot > div > div > div > div:first-child'));
  const selectNumberEdge = performance.now() - selectStartTime;

  console.log(`Selecting ${size} variable edge took ${Math.round(selectNumberEdge)} ms`);

  const moveStartTime = performance.now();
  await moveMouseBy(page, 100);
  const moveNumberEdge = performance.now() - moveStartTime;

  console.log(`Moving ${size} variable edge took ${Math.round(moveNumberEdge)} ms`);

  expect(addedNumberEdge).toBeLessThanOrEqual(60);
  expect(selectNumberEdge).toBeLessThanOrEqual(45);
  expect(moveNumberEdge).toBeLessThanOrEqual(1670);
});

test('10 edges', async ({ page }) => {
  // Go to http://localhost:5000/project/123
  await page.goto('http://localhost:5000/project/123');

  const size = 10;

  const addStartTime = performance.now();
  await addEdge(page.locator('text=add Number'), size);
  const addedNumberEdge = performance.now() - addStartTime;

  console.log(`Adding ${size} variable edges took ${Math.round(addedNumberEdge)} ms`);

  const selectStartTime = performance.now();
  await selectAllEdges(page.locator('#canvasRoot > div > div > div > div:first-child'));
  const selectNumberEdge = performance.now() - selectStartTime;

  console.log(`Selecting ${size} variable edges took ${Math.round(selectNumberEdge)} ms`);

  const startTime = performance.now();
  await moveMouseBy(page, 100);
  const moveNumberEdge = performance.now() - startTime;

  console.log(`Moving ${size} variable edges took ${Math.round(moveNumberEdge)} ms`);

  expect(addedNumberEdge).toBeLessThanOrEqual(350);
  expect(selectNumberEdge).toBeLessThanOrEqual(370);
  expect(moveNumberEdge).toBeLessThanOrEqual(1670);
});

test('50 edges', async ({ page }) => {
  // Go to http://localhost:5000/project/123
  await page.goto('http://localhost:5000/project/123');

  const size = 50;

  const addStartTime = performance.now();
  await addEdge(page.locator('text=add Number'), size);
  const addedNumberEdge = performance.now() - addStartTime;

  console.log(`Adding ${size} variable edges took ${Math.round(addedNumberEdge)} ms`);

  const selectStartTime = performance.now();
  await selectAllEdges(page.locator('#canvasRoot > div > div > div > div:first-child'));
  const selectNumberEdge = performance.now() - selectStartTime;

  console.log(`Selecting ${size} variable edges took ${Math.round(selectNumberEdge)} ms`);

  const startTime = performance.now();
  await moveMouseBy(page, 100);
  const moveNumberEdge = performance.now() - startTime;

  console.log(`Moving ${size} variable edges took ${Math.round(moveNumberEdge)} ms`);

  expect(addedNumberEdge).toBeLessThanOrEqual(1700);
  expect(selectNumberEdge).toBeLessThanOrEqual(1700);
  expect(moveNumberEdge).toBeLessThanOrEqual(1680);
});

test('100 edges', async ({ page }) => {
  // Go to http://localhost:5000/project/123
  await page.goto('http://localhost:5000/project/123');

  const size = 100;

  const addStartTime = performance.now();
  await addEdge(page.locator('text=add Number'), size);
  const addedNumberEdge = performance.now() - addStartTime;

  console.log(`Adding ${size} variable edges took ${Math.round(addedNumberEdge)} ms`);

  const selectStartTime = performance.now();
  await selectAllEdges(page.locator('#canvasRoot > div > div > div > div:first-child'));
  const selectNumberEdge = performance.now() - selectStartTime;

  console.log(`Selecting ${size} variable edges took ${Math.round(selectNumberEdge)} ms`);

  const startTime = performance.now();
  await moveMouseBy(page, 100);
  const moveNumberEdge = performance.now() - startTime;

  console.log(`Moving ${size} variable edges took ${Math.round(moveNumberEdge)} ms`);

  expect(addedNumberEdge).toBeLessThanOrEqual(3360);
  expect(selectNumberEdge).toBeLessThanOrEqual(3370);
  expect(moveNumberEdge).toBeLessThanOrEqual(1680);
});
