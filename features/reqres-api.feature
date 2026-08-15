@api @reqres @e2e
Feature: ReqRes user API
  As an API automation learner
  I want to test every common HTTP method
  So that I understand CRUD API testing with Playwright

  Scenario: GET a page of users
    When I request ReqRes users from page 2
    Then the API status code should be 200
    And the response should contain a non-empty user list

  @data-driven
  Scenario Outline: POST a new user using different test data
    When I create a user with name "<name>" and job "<job>"
    Then the API status code should be 201
    And the response field "name" should equal "<name>"
    And the response field "job" should equal "<job>"
    And the response should contain field "id"

    Examples:
      | name   | job                 |
      | Alice  | QA Engineer         |
      | Bob    | Automation Engineer |

  Scenario: PUT replaces all supplied user details
    When I replace user 2 with name "Janet" and job "Test Lead"
    Then the API status code should be 200
    And the response field "name" should equal "Janet"
    And the response field "job" should equal "Test Lead"
    And the response should contain field "updatedAt"

  Scenario: PATCH partially updates a user
    When I update user 2 job to "Senior QA Engineer"
    Then the API status code should be 200
    And the response field "job" should equal "Senior QA Engineer"
    And the response should contain field "updatedAt"

  Scenario: DELETE a user
    When I delete user 2
    Then the API status code should be 204
    And the API response body should be empty
