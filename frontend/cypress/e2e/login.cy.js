describe('Login integration (front + back)', () => {
  it('logs in with valid credentials and redirects to empleados', () => {
    const apiUrl = Cypress.env('apiUrl');
    const username = Cypress.env('username');
    const password = Cypress.env('password');

    cy.intercept('GET', `${apiUrl}/api/v1/empleados*`).as('probeEmpleados');

    cy.visit('/login');
    cy.contains('h1', 'Acceso de administrador', { timeout: 10000 });
    cy.get('form', { timeout: 10000 }).within(() => {
      cy.get('input[formcontrolname="username"]').type(username);
      cy.get('input[formcontrolname="password"]').type(password, { log: false });
    });
    cy.contains('button', 'Ingresar').click();

    cy.wait('@probeEmpleados').its('response.statusCode').should('eq', 200);
    cy.location('pathname').should('eq', '/empleados');
  });
});
