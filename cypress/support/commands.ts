/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command for logging in via email/password
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/')

    // Fill in email and password
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)

    // Submit the form
    cy.contains('button', 'Sign In').click()

    // Wait for authentication to complete
    cy.url().should('not.include', '/')
  })
})

// Custom command for signing up a new account
Cypress.Commands.add('signUp', (email: string, password: string, fullName: string) => {
  cy.visit('/')

  // Switch to sign-up mode
  cy.contains("Don't have an account? Sign Up").click()

  // Fill in the form
  cy.get('input#fullName').type(fullName)
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)

  // Submit the form
  cy.contains('button', 'Sign Up').click()
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      signUp(email: string, password: string, fullName: string): Chainable<void>
    }
  }
}

export {}
