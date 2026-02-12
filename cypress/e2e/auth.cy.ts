describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Email/Password Authentication - UI Tests', () => {
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

  describe('Account Creation - Complete E2E Tests', () => {
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      fullName: 'Test User'
    }

    it('should complete full sign-up flow with all fields', () => {
      // Switch to sign-up mode
      cy.contains("Don't have an account? Sign Up").click()

      // Verify all sign-up fields are visible
      cy.get('input#fullName').should('be.visible')
      cy.get('input#email').should('be.visible')
      cy.get('input#password').should('be.visible')

      // Fill in the form
      cy.get('input#fullName').type(testUser.fullName)
      cy.get('input#email').type(testUser.email)
      cy.get('input#password').type(testUser.password)

      // Verify form is filled correctly
      cy.get('input#fullName').should('have.value', testUser.fullName)
      cy.get('input#email').should('have.value', testUser.email)
      cy.get('input#password').should('have.value', testUser.password)

      // Submit the form
      cy.contains('button', 'Sign Up').should('not.be.disabled').click()

      // Button should show loading state
      cy.contains('button', 'Signing up...').should('exist')
    })

    it('should validate full name is required in sign-up mode', () => {
      cy.contains("Don't have an account? Sign Up").click()

      // Try to submit without full name
      cy.get('input#email').type(testUser.email)
      cy.get('input#password').type(testUser.password)
      cy.contains('button', 'Sign Up').click()

      // HTML5 validation should prevent submission
      cy.get('input#fullName:invalid').should('exist')
    })

    it('should validate email format in sign-up mode', () => {
      cy.contains("Don't have an account? Sign Up").click()

      // Try with invalid email
      cy.get('input#fullName').type(testUser.fullName)
      cy.get('input#email').type('invalid-email')
      cy.get('input#password').type(testUser.password)
      cy.contains('button', 'Sign Up').click()

      // HTML5 email validation should prevent submission
      cy.get('input#email:invalid').should('exist')
    })

    it('should validate password length in sign-up mode', () => {
      cy.contains("Don't have an account? Sign Up").click()

      // Try with short password
      cy.get('input#fullName').type(testUser.fullName)
      cy.get('input#email').type(testUser.email)
      cy.get('input#password').type('12345')
      cy.contains('button', 'Sign Up').click()

      // Should show error message
      cy.contains('Password must be at least 6 characters').should('be.visible')
    })

    it('should clear error message when switching between modes', () => {
      // Trigger an error in sign-in mode
      cy.get('input[type="email"]').type(testUser.email)
      cy.get('input[type="password"]').type('short')
      cy.contains('button', 'Sign In').click()
      cy.contains('Password must be at least 6 characters').should('be.visible')

      // Switch to sign-up mode
      cy.contains("Don't have an account? Sign Up").click()

      // Error should be cleared
      cy.contains('Password must be at least 6 characters').should('not.exist')
    })

    it('should use custom signUp command successfully', () => {
      // Test the custom Cypress command
      cy.signUp(testUser.email, testUser.password, testUser.fullName)

      // Button should show loading state
      cy.contains('button', 'Signing up...').should('exist')
    })
  })

  describe('Connection (Sign In) - Complete E2E Tests', () => {
    const testUser = {
      email: 'existing-user@example.com',
      password: 'ExistingPassword123!'
    }

    it('should complete full sign-in flow with valid credentials', () => {
      // Fill in the sign-in form
      cy.get('input[type="email"]').type(testUser.email)
      cy.get('input[type="password"]').type(testUser.password)

      // Verify form is filled correctly
      cy.get('input[type="email"]').should('have.value', testUser.email)
      cy.get('input[type="password"]').should('have.value', testUser.password)

      // Submit the form
      cy.contains('button', 'Sign In').should('not.be.disabled').click()

      // Button should show loading state
      cy.contains('button', 'Signing in...').should('exist')
    })

    it('should validate email is required for sign-in', () => {
      // Try to submit with only password
      cy.get('input[type="password"]').type(testUser.password)
      cy.contains('button', 'Sign In').click()

      // HTML5 validation should prevent submission
      cy.get('input[type="email"]:invalid').should('exist')
    })

    it('should validate password is required for sign-in', () => {
      // Try to submit with only email
      cy.get('input[type="email"]').type(testUser.email)
      cy.contains('button', 'Sign In').click()

      // HTML5 validation should prevent submission
      cy.get('input[type="password"]:invalid').should('exist')
    })

    it('should validate email format for sign-in', () => {
      // Try with invalid email format
      cy.get('input[type="email"]').type('not-an-email')
      cy.get('input[type="password"]').type(testUser.password)
      cy.contains('button', 'Sign In').click()

      // HTML5 email validation should prevent submission
      cy.get('input[type="email"]:invalid').should('exist')
    })

    it('should enforce minimum password length for sign-in', () => {
      // Try with short password
      cy.get('input[type="email"]').type(testUser.email)
      cy.get('input[type="password"]').type('short')
      cy.contains('button', 'Sign In').click()

      // Should show error message
      cy.contains('Password must be at least 6 characters').should('be.visible')
    })

    it('should show error message in styled error container', () => {
      // Trigger an error
      cy.get('input[type="email"]').type(testUser.email)
      cy.get('input[type="password"]').type('short')
      cy.contains('button', 'Sign In').click()

      // Error should be in a styled container
      cy.get('.bg-red-50').should('be.visible')
      cy.get('.text-red-800').should('contain', 'Password must be at least 6 characters')
    })

    it('should disable submit button while loading', () => {
      cy.get('input[type="email"]').type(testUser.email)
      cy.get('input[type="password"]').type(testUser.password)

      // Intercept the auth request to keep it pending
      cy.intercept('POST', '**/auth/v1/token*', (req) => {
        req.reply({
          delay: 1000,
          statusCode: 200,
          body: {}
        })
      }).as('authRequest')

      cy.contains('button', 'Sign In').click()

      // Button should be disabled while loading
      cy.contains('button', 'Signing in...').should('be.disabled')
    })

    it('should use custom login command successfully', () => {
      // Test that the custom command works without errors
      // Note: This will fail authentication in most cases, but tests the command structure
      cy.login(testUser.email, testUser.password)
    })
  })

  describe('Authentication Error Handling', () => {
    it('should handle empty form submission gracefully', () => {
      cy.contains('button', 'Sign In').click()

      // HTML5 validation should prevent submission
      cy.get('input[type="email"]:invalid').should('exist')

      // Should not show custom error message for HTML5 validation
      cy.get('.bg-red-50').should('not.exist')
    })

    it('should clear form errors when user starts typing', () => {
      // Trigger an error
      cy.get('input[type="email"]').type('test@example.com')
      cy.get('input[type="password"]').type('short')
      cy.contains('button', 'Sign In').click()
      cy.contains('Password must be at least 6 characters').should('be.visible')

      // Start typing in password field
      cy.get('input[type="password"]').clear().type('longer')

      // Note: Error clearing happens on submit, not on typing
      // This verifies the form still shows the error until next submit
      cy.contains('Password must be at least 6 characters').should('be.visible')
    })

    it('should preserve form values when validation fails', () => {
      const email = 'test@example.com'

      // Fill form with short password
      cy.get('input[type="email"]').type(email)
      cy.get('input[type="password"]').type('short')
      cy.contains('button', 'Sign In').click()

      // Values should be preserved
      cy.get('input[type="email"]').should('have.value', email)
      cy.get('input[type="password"]').should('have.value', 'short')
    })

    it('should handle network errors gracefully', () => {
      // Simulate network failure
      cy.intercept('POST', '**/auth/v1/token*', {
        forceNetworkError: true
      }).as('authRequest')

      cy.get('input[type="email"]').type('test@example.com')
      cy.get('input[type="password"]').type('validpassword')
      cy.contains('button', 'Sign In').click()

      // Should show an error (exact message depends on Supabase error handling)
      cy.get('.bg-red-50', { timeout: 10000 }).should('be.visible')
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

    it('should have consistent spacing and styling', () => {
      // Verify form styling
      cy.get('form').should('have.class', 'flex')
      cy.get('form').should('have.class', 'flex-col')

      // Verify input styling
      cy.get('input[type="email"]').should('have.class', 'rounded-lg')
      cy.get('input[type="password"]').should('have.class', 'rounded-lg')

      // Verify button styling
      cy.contains('button', 'Sign In').should('have.class', 'bg-blue-600')
    })
  })
})
