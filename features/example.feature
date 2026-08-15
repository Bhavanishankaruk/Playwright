@login @e2e
Feature: Login to The Internet application
  As a user of The Internet application
  I want to log in with different credentials
  So that valid users can enter and invalid users see a useful error

  Background:
    Given I am on the login page

  @data-driven
  Scenario Outline: Login using valid and invalid credentials
    When I log in with username "<username>" and password "<password>"
    Then the login outcome should be "<outcome>"
    And the login message should contain "<message>"

    Examples:
      | username | password             | outcome | message                           |
      | tomsmith | SuperSecretPassword! | success | You logged into a secure area!    |
      | dummy    | dummy                | failure | Your username is invalid!         |
