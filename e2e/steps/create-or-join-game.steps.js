import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Given("I have already registered as {string}", async ({ page }, name) => {
  await page.goto("/");
  await page.getByTestId("player-name-input").fill(name);
  await page.getByTestId("register-continue").click();
  await expect(page.getByTestId("create-page")).toBeVisible();
});

When("I click Create Game", async ({ page }) => {
  await page.route("*/**/api/game/create", async (route) => {
    await route.fulfill({
      json: {
        gameId: "successfull-gameId-123",
        player: { id: "123", name: "Anna" }
      }
    });
  });
  await page.getByTestId("create-game-btn").click();
});

Then("I should see a Game ID to share with my opponent", async ({ page }) => {
  await expect(page.locator(".code")).toBeVisible();
    await expect(page.locator(".code")).toHaveText("successfull-gameId-123");
});

When("I click {string}", async ({ page}, text) => {
  await page.getByRole("button", { name: text }).click();
});

Then("I should see the join game form", async ({page }) => {
  await expect(page.getByTestId("join-page")).toBeVisible();
});

When("I enter the Game ID", async ({ page }) => {
  await page.getByTestId("join-game-id-input").fill("fake-gameId");
});

  When("I click Join Game successfully", async ({ page }) => {
  await page.route("*/**/api/game/join", async (route) => {
    await route.fulfill({
      json: {
        player: { id: "123", name: "Anna" }
      }
    });
  });
  await page.getByTestId("join-game-btn").click();
  });

  When("I click Join Game with invalid ID", async ({ page }) => {
    await page.route("*/**/api/game/join", async (route) => {
      await route.fulfill({
      status: 400,
      json: {error: "Failed to join game"}
    })
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

When("I click Create Game with server errors", async ({page}) => {
  await page.route("*/**/api/game/create", async (route) => {
    await route.fulfill({
      status: 500,
      json: {error: "Failed to create game"}
    })
  })
  await page.getByTestId("create-game-btn").click();
});

Then("the Join Game button should be disabled", async ({ page }) => {
  await expect(page.getByTestId("join-game-btn")).toBeDisabled();
})