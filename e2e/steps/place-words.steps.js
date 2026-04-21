import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

Then("the Ready button should be disabled", async ({ page }) => {
  await expect(page.getByTestId("ready-btn")).toBeDisabled();
});

When("I click on a word button", async ({ page }) => {
  await page.getByTestId("word-button").first().click();
});

Then("I should see the placement info text", async ({ page }) => {
  await expect(page.locator(".placement-info")).toBeVisible();
});

When("I click on the word {string}", async ({ page }, word) => {
  await page.getByTestId("word-button").getByText(word).click();
});

Then("the button for {string} should have the selected class", async ({ page }, word) => {
  await expect(page.getByTestId("word-button").getByText(word)).toHaveClass(/selected/);
});

Then("the button for {string} should be disabled", async ({ page }, word) => {
  await expect(page.getByTestId("word-button").getByText(word)).toBeDisabled();
});

Then("I should see the placement grid", async ({ page }) => {
  await expect(page.getByTestId("placement-grid")).toBeVisible();
});

When("I place the word on the grid", async ({ page }) => {
  await page.locator(".cell").first().click();
});

When("I try to place the word on the same cell", async ({ page }) => {
  await page.locator(".cell").first().click();
});

Then("{string} should still be in the word list", async ({ page }, word) => {
  await expect(page.getByTestId("word-button").getByText(word)).toBeEnabled();
});

When("I place the word on a different row", async ({ page }) => {
    await page.locator(".cell").nth(10).click();
});

Then("the Ready button should be enabled", async ({ page }) => {
  await expect(page.getByTestId("ready-btn")).toBeEnabled();
});