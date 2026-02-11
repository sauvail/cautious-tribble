describe('Landing Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the StrongCoach landing page', () => {
    cy.contains('h1', 'StrongCoach').should('be.visible')
    cy.contains('Empower your training journey').should('be.visible')
  })

  it('should display the Google sign-in button', () => {
    cy.contains('button', 'Sign in with Google').should('be.visible')
  })

  it('should display feature list', () => {
    cy.contains('Create and manage workout programs').should('be.visible')
    cy.contains('Track sets, reps, and weight for each exercise').should('be.visible')
    cy.contains('Monitor athlete progress and stats').should('be.visible')
    cy.contains('Message system for coach-athlete communication').should('be.visible')
  })

  it('should have proper styling and layout', () => {
    cy.get('main').should('have.class', 'rounded-2xl')
    cy.get('main').should('have.class', 'bg-white')
  })
})
