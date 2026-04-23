import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();

Given("the game has started", async ({ page }) => {
  await page.route("*/**/api/game/test-game-123/ready", async (route) => {
    await route.fulfill({
      json: { bothReady: true },
    });
  });

  await page.route("*/**/api/player/player-2", async (route) => {
    await route.fulfill({
      json: {
        player: {
          id: "player-2",
          name: "Opponent",
          wordList: [
            {
              name: "cat",
              letters: [
                { value: "c", found: false, row: 0, col: 0 },
                { value: "a", found: false, row: 0, col: 1 },
                { value: "t", found: false, row: 0, col: 2 },
              ],
            },
            {
              name: "dog",
              letters: [
                { value: "d", found: false, row: 1, col: 0 },
                { value: "o", found: false, row: 1, col: 1 },
                { value: "g", found: false, row: 1, col: 2 },
              ],
            },
          ],
        },
      },
    });
  });

  await expect(page.getByTestId("opponent-grid")).toBeVisible();
  await expect(page.getByTestId("player-grid")).toBeVisible();
});

Given("it is the opponent's turn", async ({ page }) => {
  await page.route("*/**/api/game/test-game-123", async (route) => {
    await route.fulfill({
      json: {
        player1: { id: "player-1", name: "Anna" },
        player2: { id: "player-2", name: "Opponent" },
        turn: "player-2",
      },
    });
  });
  await expect(page.locator(".turn-indicator")).toHaveText("Waiting for opponent...");
});

Then("I should see the opponent's board", async ({ page }) => {
  await expect(page.getByTestId("opponent-grid")).toBeVisible();
});

Then("I should see my board", async ({ page }) => {
  await expect(page.getByTestId("player-grid")).toBeVisible();
});

// --- Turn indicator ---

Then("I should see the turn indicator {string}", async ({ page }, text) => {
  await expect(page.locator(".turn-indicator")).toHaveText(text);
});

Then("the guess input should be enabled", async ({ page }) => {
  await expect(page.getByTestId("guess-input")).toBeEnabled();
});

Then("the guess input should be disabled", async ({ page }) => {
  await expect(page.getByTestId("guess-input")).toBeDisabled();
});

Then("the guess button should be enabled", async ({ page }) => {
  await expect(page.getByTestId("guess-btn")).toBeEnabled();
});

Then("the guess button should be disabled", async ({ page }) => {
  await expect(page.getByTestId("guess-btn")).toBeDisabled();
});

When("I type the letter {string} and submit", async ({ page }, letter) => {
  await page.route("*/**/api/player/guess", async (route) => {
    await route.fulfill({ json: "Miss" });
  });
  await page.route("*/**/api/game/test-game-123", async (route) => {
    await route.fulfill({
      json: {
        player1: { id: "player-1", name: "Anna" },
        player2: { id: "player-2", name: "Opponent" },
        turn: "player-1",
      },
    });
  });
  await page.getByTestId("guess-input").fill(letter);
  await page.getByTestId("guess-btn").click();
  await expect(page.getByTestId("guessed-letters")).toContainText(letter); 
});

When("I type {string} in the guess input", async ({ page }, value) => {
  await page.getByTestId("guess-input").fill(value);
});

When("I click the guess button", async ({ page }) => {
  await page.getByTestId("guess-btn").click();
});

When("I guess the letter {string} and it is a hit", async ({ page }, letter) => {
  await page.route("*/**/api/player/guess", async (route) => {
    await route.fulfill({ json: "Hit" });
  });
  await page.route("*/**/api/game/test-game-123", async (route) => {
    await route.fulfill({
      json: {
        player1: { id: "player-1", name: "Anna" },
        player2: { id: "player-2", name: "Opponent" },
        turn: "player-1",
      },
    });
  });
  await page.getByTestId("guess-input").fill(letter);
  await page.getByTestId("guess-btn").click();
});

Then("{string} should appear in the guessed letters list", async ({ page }, letter) => {
  await expect(page.getByTestId("guessed-letters")).toContainText(letter);
});

Then("I should see the guess error {string}", async ({ page }, errorMessage) => {
  await expect(page.locator(".error")).toHaveText(errorMessage);
});

Then("the cell with {string} should have the class {string}", async ({ page }, letter, className) => {
  await expect(page.locator(`.${className}`).first()).toBeVisible();
});

Then("I should see the words left count {string}", async ({ page }, text) => {
  await expect(page.locator(".status-badge.left")).toHaveText(text);
});

Then("I should see the words found count {string}", async ({ page }, text) => {
  await expect(page.locator(".status-badge.found")).toHaveText(text);
});