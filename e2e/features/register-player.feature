Feature: Register Player

  Background:
    Given I am on the register page

  Scenario: Successfully register with valid name
    When I enter the name "Anna"
    And I click Continue
    Then I should see the create or join page

  Scenario: Show error when submitting without a name
    When I click Continue without entering a name
    Then I should see the error "You must enter a name"

  Scenario: Show error when submitting with only spaces in name
    When I enter the name "    "
    And I click Continue
    Then I should see the error "You must enter a name"