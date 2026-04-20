import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Given("I click {string}", async ({ page }, text) => {
  await page.getByRole("button", { name: text }).click();
});

Given("I have registered as {string}", async ({ page }, name) => {
  await page.goto("/");
  await page.getByTestId("player-name-input").fill(name);
  await page.getByTestId("register-continue").click();
  await expect(page.getByTestId("create-page")).toBeVisible();
});

When('I click Create Game', async ({ page }) => {
  await page.getByTestId("create-game-btn").click();
});


// When("I place all my words and click ready", async ({ page }) => {
//   await page.route("*/**/api/player/place", async (route) => {
//     await route.fulfill({ json: { ready: true } });
//   });
// });

When("I click Join Game successfully", async ({ page }) => {
  await page.route("*/**/api/game/join", async (route) => {
    await route.fulfill({
      json: {
        gameId: "fake-game-id",
        player: { id: "123", name: "Anna" }
      }
    });
  });
  await page.route("*/**/api/player/123", async (route) => {
    await route.fulfill({
      json: {
        player: { id: "123", name: "Anna", wordList: [] }
      }
    });
  });
  await page.getByTestId("join-game-btn").click();
});

Given("I have created a game", async ({ page }) => {
  // Mockar skapande av spel och returnerar gameId och player
  await page.route("*/**/api/game/create", async (route) => {
    await route.fulfill({
      json: {
        gameId: "test-game-123",
        player: { id: "player-1", name: "Anna" }
      }
    });
  });

  // Mockar spelinfo med båda players och vems tur det är
  await page.route("*/**/api/game/test-game-123", async (route) => {
    await route.fulfill({
      json: {
        player1: { id: "player-1", name: "Anna" },
        player2: { id: "player-2", name: "Opponent" },
        turn: "player-1"
      }
    });
  });

  // Mockar players ord med oplacerade positioner
  await page.route("*/**/api/player/player-1", async (route) => {
    await route.fulfill({
      json: {
        player: {
          id: "player-1",
          name: "Anna",
          wordList: [
            {
              name: "cat", letters: [
                { value: "c", found: false, row: -1, col: -1 },
                { value: "a", found: false, row: -1, col: -1 },
                { value: "t", found: false, row: -1, col: -1 }
              ]
            },
            {
              name: "dog", letters: [
                { value: "d", found: false, row: -1, col: -1 },
                { value: "o", found: false, row: -1, col: -1 },
                { value: "g", found: false, row: -1, col: -1 }
              ]
            }
          ]
        }
      }
    });
  });

  await page.getByTestId("create-game-btn").click();
  await page.getByTestId("refresh-btn").click();
});