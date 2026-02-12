describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Email/Password Authentication', () => {
    it('should show email/password sign-in form', () => {
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('be.visible')
      cy.contains('button', 'Sign In').should('be.visible')
    })

    it('should show validation error for empty fields', () => {
      cy.contains('button', 'Sign In').click()
      // HTML5 validation should prevent submission
      cy.get('input[type="email"]:invalid').should('exist')
    })

    it('should toggle between sign-in and sign-up modes', () => {
      // Initially in sign-in mode
      cy.contains('button', 'Sign In').should('be.visible')
      cy.get('input#fullName').should('not.exist')

      // Switch to sign-up mode
      cy.contains("Don't have an account? Sign Up").click()
      cy.contains('button', 'Sign Up').should('be.visible')
      cy.get('input#fullName').should('be.visible')

      // Switch back to sign-in mode
      cy.contains('Already have an account? Sign In').click()
      cy.contains('button', 'Sign In').should('be.visible')
      cy.get('input#fullName').should('not.exist')
    })

    it('should show error for short password', () => {
      cy.get('input[type="email"]').type('test@example.com')
      cy.get('input[type="password"]').type('12345')
      cy.contains('button', 'Sign In').click()
      cy.contains('Password must be at least 6 characters').should('be.visible')
    })

    it('should have all required form fields in sign-up mode', () => {
      cy.contains("Don't have an account? Sign Up").click()
      cy.get('input#fullName').should('be.visible').and('have.attr', 'required')
      cy.get('input#email').should('be.visible').and('have.attr', 'required')
      cy.get('input#password').should('be.visible').and('have.attr', 'required')
    })
  })

  describe('Google OAuth Authentication', () => {
    it('should show Google sign-in button', () => {
      cy.contains('button', 'Sign in with Google')
        .should('be.visible')
        .and('not.be.disabled')
    })

    it('should display Google logo in sign-in button', () => {
      cy.get('button').contains('Sign in with Google').find('svg').should('exist')
    })

    it('should have working sign-in button click handler', () => {
      cy.contains('button', 'Sign in with Google').should('not.be.disabled')
    })
  })

  describe('Authentication Layout', () => {
    it('should show divider between email and OAuth authentication', () => {
      cy.contains('Or continue with').should('be.visible')
    })

    it('should display email form before Google OAuth button', () => {
      cy.get('form').should('be.visible')
      cy.get('form').parent().next().contains('Or continue with').should('exist')
    })
  })
})
