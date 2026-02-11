describe('User Setup Flow', () => {
  beforeEach(() => {
    cy.visit('/setup')
  })

  it('should display the setup page', () => {
    cy.contains('h1', 'Welcome to StrongCoach').should('be.visible')
    cy.contains("Let's set up your profile").should('be.visible')
  })

  it('should have role selection options', () => {
    cy.contains('Coach').should('be.visible')
    cy.contains('Athlete').should('be.visible')
    cy.contains('Both').should('be.visible')
  })

  it('should require full name', () => {
    cy.get('input#fullName').should('exist')
  })

  it('should show invitation token field when athlete is selected', () => {
    // Initially should not show invitation token field
    cy.get('input#invitationToken').should('not.exist')

    // Click on Athlete role
    cy.contains('button', 'Athlete').click()

    // Should now show invitation token field
    cy.get('input#invitationToken').should('be.visible')
  })

  it('should show invitation token field when both is selected', () => {
    cy.contains('button', 'Both').click()
    cy.get('input#invitationToken').should('be.visible')
  })

  it('should not show invitation token field when coach is selected', () => {
    cy.contains('button', 'Coach').click()
    cy.get('input#invitationToken').should('not.exist')
  })

  it('should have complete setup button', () => {
    cy.contains('button', 'Complete Setup').should('be.visible')
  })
})
