import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Given("I am on the register page", async ({page}) => {
  await page.goto("/");
  await expect(page.getByTestId("register-page")).toBeVisible();
});

When("I enter the name {string}", async ({page}, name) => {
  await page.getByTestId("player-name-input").fill(name);
})

When("I click Continue",  async({page}) => {
  await page.getByTestId("register-continue").click();
})

When("I click Continue without entering a name", async ({ page }) => {
  await page.getByTestId("register-continue").click();
})

Then("I should see the create or join page", async ({ page }) => {
  await expect(page.getByTestId("create-page")).toBeVisible();
})

Then("I should see the error {string}", async ({ page }, errorMessage) => {
  await expect(page.locator(".error")).toHaveText(errorMessage);
})

