Feature: Game Page

  Background:
    Given I have registered as "Anna"
    And I have created a game
    And I place all my words and click ready
    And the game has started

  Scenario: I can see both grids
    Then I should see the opponent's board
    And I should see my board

  Scenario: Player can guess when it is their turn
    Then I should see the turn indicator "Your turn!"
    And the guess input should be enabled
    And the guess button should be enabled

  Scenario: Player cannot guess when it is the opponent's turn
    Given it is the opponent's turn
    Then I should see the turn indicator "Waiting for opponent..."
    And the guess input should be disabled
    And the guess button should be disabled

  Scenario: Guessed letter shows up in the list
    When I type the letter "a" and submit
    Then "a" should appear in the guessed letters list

  Scenario: Player can't guess the same letter twice
    When I type the letter "a" and submit
    And I type "a" in the guess input
    And I click the guess button
    Then I should see the guess error "You have already guessed this letter"

  Scenario: Only letters are allowed as input
    When I type "3" in the guess input
    Then I should see the guess error "Only letters (A-Z) are allowed"

  Scenario: Words left counter shows correct at start
    Then I should see the words left count "2 words left"

  Scenario: Words found counter is zero at start
    Then I should see the words found count "0 words found"

  Scenario: A correct guess is highlighted on the opponent's board
    When I guess the letter "c" and it is a hit
    Then the cell with "c" should have the class "cell-hit"