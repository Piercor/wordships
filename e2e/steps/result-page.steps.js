import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Given("I have completed a game as winner", async ({ page }) => {
  await page.route("*/**/api/game/test-game-123", async (route) => {
    await route.fulfill({
      json: {
        player1: { id: "player-1", name: "Anna" },
        player2: { id: "player-2", name: "Opponent" },
        turn: "player-1",
        winner: { id: "player-1", name: "Anna" }
      }
    });
  });

});

Given("I have completed a game as loser", async ({ page }) => {
  await page.route("*/**/api/game/create", async (route) => {
    await route.fulfill({
      json: {
        gameId: "test-game-123",
        player: { id: "player-1", name: "Anna" }
      }
    });
  });

  await page.route("*/**/api/player/player-1", async (route) => {
    await route.fulfill({
      json: {
        player: {
          id: "player-1",
          name: "Anna",
          wordList: []
        }
      }
    });
  });

  await page.route("*/**/api/game/test-game-123", async (route) => {
    await route.fulfill({
      json: {
        player1: { id: "player-1", name: "Anna" },
        player2: { id: "player-2", name: "Opponent" },
        turn: "player-2",
        winner: { id: "player-2", name: "Opponent" }
      }
    });
  });

  await page.getByTestId("reset-game-btn").click();
  await page.getByTestId("create-game-btn").click();
  await page.getByTestId("refresh-btn").click();
});

When("I reload the page", async ({ page }) => {
  await page.reload();
});

Then("I should see the heading {string}", async ({ page }, text) => {
  await expect(page.getByRole("heading", { name: text })).toBeVisible();
});

Then("I should see the winner name {string}", async ({ page }, name) => {
  await expect(page.locator(".result-page")).toContainText(name);
});