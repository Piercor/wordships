import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

Then("I should see a Game ID to share with my opponent", async ({ page }) => {
  await expect(page.locator(".code")).toBeVisible();
  const gameId = await page.locator(".code").textContent();
  expect(gameId).toMatch(/^(?:\{{0,1}(?:[0-9a-fA-F]){8}-(?:[0-9a-fA-F]){4}-(?:[0-9a-fA-F]){4}-(?:[0-9a-fA-F]){4}-(?:[0-9a-fA-F]){12}\}{0,1})$/);
});

Then("I should see the join game form", async ({ page }) => {
  await expect(page.getByTestId("join-page")).toBeVisible();
});

When("I enter the Game ID", async ({ page }) => {
  await page.getByTestId("join-game-id-input").fill("fake-gameId");
});

When("I click Join Game with invalid ID", async ({ page }) => {
  await page.route("*/**/api/game/join", async (route) => {
    await route.fulfill({
      status: 400,
      json: { error: "Failed to join game" }
    });
  });

  await page.getByTestId("join-game-btn").click();
});

Then("I should see a confirmation that I joined a game", async ({ page }) => {
  await expect(page.getByText("Game Joined!")).toBeVisible();
  await expect(page.locator(".success")).toBeVisible();
  await expect(page.getByText("You've successfully joined the game.")).toBeVisible();
});

Then("I should see the error message {string}", async ({ page }, errorMessage) => {
  await expect(page.locator(".error")).toBeVisible();
  await expect(page.locator(".error")).toHaveText(errorMessage);
});

Then("I should see the create game form", async ({ page }) => {
  await expect(page.getByTestId("create-page")).toBeVisible();
});

When("I click Create Game with server errors", async ({ page }) => {
  await page.route("*/**/api/game/create", async (route) => {
    await route.fulfill({
      status: 500,
      json: { error: "Failed to create game" }
    });
  });
  await page.getByTestId("create-game-btn").click();
});

Then("the Join Game button should be disabled", async ({ page }) => {
  await expect(page.getByTestId("join-game-btn")).toBeDisabled();
});