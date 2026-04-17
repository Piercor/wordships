import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Given("I have already registered as {string} and joined a game", async ({ page }, name) => {
  await page.goto("/");
  await page.getByTestId("player-name-input").fill(name);
  await page.getByTestId("register-continue").click();

  await page.route("*/**/api/game/create", async (route) => {
    await route.fulfill({
      json: {
        gameId: "test-game-123",
        player: { id: "player-1", name }
      }
    });
  });

  await page.route("*/**/api/game/test-game-123", async (route) => {
    await route.fulfill({
      json: {
        player1: { id: "player-1", name },
        player2: { id: "player-2", name: "Opponent" }
      }
    });
  });

  await page.route("*/**/api/player/player-1", async (route) => {
    await route.fulfill({
      json: {
        player: {
          id: "player-1",
          name,
          wordList: [
            { name: "cat", letters: [
              { value: "c", found: false, row: 0, col: 0 },
              { value: "a", found: false, row: 0, col: 1 },
              { value: "t", found: false, row: 0, col: 2 }
            ]
            },
            { name: "dog", letters: [
              { value: "d", found: false, row: 0, col: 0 },
              { value: "o", found: false, row: 0, col: 1 },
              { value: "g", found: false, row: 0, col: 2 }
            ]}
          ]
        }
      }
    });
  });

  await page.getByTestId("create-game-btn").click();
  await page.getByTestId("refresh-btn").click();
});

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
})

Then("the button for {string} should have the selected class", async ({ page }, word) => {
  await expect(page.getByTestId("word-button").getByText(word)).toHaveClass(/selected/);
});

Then("the button for {string} should be disabled", async ({ page }, word) => {
    await expect(page.getByTestId("word-button").getByText(word)).toBeDisabled();
})

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
  await expect(page.getByTestId("word-button").getByText(word)).toBeEnabled()
});