Feature: Result Page

  Background:
    Given I have registered as "Anna"
    And I have created a game
    And I place all my words and click ready

  Scenario: Winner sees win message and winner name
    Given I have completed a game as winner
    Then I should see the heading "You won!"
    And I should see the winner name "Anna"

  Scenario: Loser sees loss message and winner name
    Given I have completed a game as loser
    Then I should see the heading "You lost!"
    And I should see the winner name "Opponent"

  Scenario: Refresh keeps result for winner
    Given I have completed a game as winner
    When I reload the page
    Then I should see the heading "You won!"

  Scenario: Refresh keeps result for loser
    Given I have completed a game as loser
    When I reload the page
    Then I should see the heading "You lost!"

  Scenario: Winner can play again
    Given I have completed a game as winner
    When I click "Play again"
    Then I should see the create page

  Scenario: Loser can play again
    Given I have completed a game as loser
    When I click "Play again"
    Then I should see the create page