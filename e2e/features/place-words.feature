Feature: Place words

  Background:
    Given I have registered as "Anna"
    And I have created a game

  Scenario: Grid is visible
    Then I should see the placement grid

  Scenario: Ready button is disabled before all words are placed
    Then the Ready button should be disabled

  Scenario: Select a word
    When I click on a word button
    Then I should see the placement info text

  Scenario: Selected word is highlighted
    When I click on the word "CAT"
    Then the button for "CAT" should have the selected class

  Scenario: Word button is disabled after placing
    When I click on the word "CAT"
    And I place the word on the grid
    Then the button for "CAT" should be disabled

  Scenario: Cannot place word on occupied cell
    When I click on the word "CAT"
    And I place the word on the grid
    When I click on the word "DOG"
    And I try to place the word on the same cell
    Then "DOG" should still be in the word list

  Scenario: Ready button is enabled after all words are placed
    When I click on the word "CAT"
    And I place the word on the grid
    And I click on the word "DOG"
    And I place the word on a different row
    Then the Ready button should be enabled

  Scenario: Can remove a placed word
    When I click on the word "CAT"
    And I place the word on the grid
    And I click on the placed word "CAT"
    Then I should see a remove button
    When I click the remove button
    Then the button for "CAT" should be enabled

  Scenario: Can change direction to vertical
    When I click on the word "CAT"
    And I click the direction button
    Then the direction should be vertical