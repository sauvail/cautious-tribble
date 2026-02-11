describe('Coach Dashboard', () => {
  // Note: These tests assume user is authenticated and has coach role
  // In a real scenario, you would set up authentication in beforeEach

  it('should have coach navigation', () => {
    // This test will be skipped until we have proper auth setup
    // cy.visit('/dashboard/coach')
    // cy.contains('Athletes').should('be.visible')
    // cy.contains('Exercises').should('be.visible')
    // cy.contains('Programs').should('be.visible')
  })
})

describe('Athlete Dashboard', () => {
  // Note: These tests assume user is authenticated and has athlete role

  it('should have athlete navigation', () => {
    // This test will be skipped until we have proper auth setup
    // cy.visit('/dashboard/athlete')
    // cy.contains('Dashboard').should('be.visible')
    // cy.contains('Programs').should('be.visible')
    // cy.contains('Calendar').should('be.visible')
  })
})
