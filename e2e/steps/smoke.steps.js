import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, Then } = createBdd();

Given('att jag öppnar startsidan', async ({ page }) => {
  await page.goto('/');
});

Given('att jag öppnar {string} i webbläsaren', async ({ page }, path) => {
  await page.goto(path);
});

Then('ska jag se en rubrik på nivå {int} på sidan', async ({ page }, level) => {
  const heading = page.locator(`h${level}`);
  await expect(heading).toBeVisible();
});

Then('ska jag se texten {string}', async ({ page }, text) => {
  await expect(page.locator('body')).toContainText(text);
});

Then('ska jag se 100 rutor på sidan', async ({ page }) => {
  const cells = page.locator('.grid-cell');
  await expect(cells).toHaveCount(100);
});

Then('ska rutorna vara tomma', async ({ page }) => {
  const cells = page.locator('.grid-cell');
  await expect(cells).toHaveText(Array(100).fill(''));
});