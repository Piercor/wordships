Feature: Create or Join Game

  Background:
    Given I have already registered as "Anna"

  Scenario: Create new game
    When I click Create Game
    Then I should see a Game ID to share with my opponent

  Scenario: Switch to join view
    When I click "Already have a Game ID? Join instead"
    Then I should see the join game form

  Scenario: Successfully join a game
    When I click "Already have a Game ID? Join instead"
    And I enter the Game ID
    And I click Join Game successfully
    Then I should see a confirmation that I joined a game

  Scenario: Show error when entering invalid Game ID
    When I click "Already have a Game ID? Join instead"
    And I enter the Game ID
    And I click Join Game with invalid ID
    Then I should see the error message "Failed to join game"

  Scenario: Switch back to create view
    When I click "Already have a Game ID? Join instead"
    And I click "Create a new game instead"
    Then I should see the create game form

  Scenario: Show error when create game fails
    When I click Create Game with server errors
    Then I should see the error message "Failed to create game"

  Scenario: Join button is disabled without a Game ID
    When I click "Already have a Game ID? Join instead"
    Then the Join Game button should be disabled