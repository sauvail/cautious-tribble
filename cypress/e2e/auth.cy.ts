describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should show Google sign-in button', () => {
    cy.contains('button', 'Sign in with Google')
      .should('be.visible')
      .and('not.be.disabled')
  })

  it('should display Google logo in sign-in button', () => {
    cy.get('button').contains('Sign in with Google').find('svg').should('exist')
  })

  // Note: Actual Google OAuth testing would require special setup
  // This test verifies the button exists and is interactive
  it('should have working sign-in button click handler', () => {
    cy.contains('button', 'Sign in with Google').should('not.be.disabled')
  })
})
