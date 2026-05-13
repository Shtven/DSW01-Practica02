describe('Login integration (front + back)', () => {

  it('logs in with valid credentials and redirects to empleados', () => {

    const username = Cypress.env('username');
    const password = Cypress.env('password');

    cy.visit('/login');

    cy.contains('Acceso de administrador', { timeout: 30000 })
      .should('be.visible');

    cy.get('input[formcontrolname="username"]')
      .type(username);

    cy.get('input[formcontrolname="password"]')
      .type(password, { log: false });

    cy.contains('button', 'Ingresar')
      .click();

    cy.location('pathname', { timeout: 30000 })
      .should('include', '/empleados');

  });

});