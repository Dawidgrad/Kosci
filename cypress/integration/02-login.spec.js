/// <reference types="cypress" />

describe('Cypress login testing', () => {
	it('Visit login page', () => {
		cy.visit('/login');

		cy.contains('h3', 'Log-In');

		cy.get('nav').contains('Log-in');
		cy.get('nav').contains('Register');
		cy.get('nav').contains('Kosci');
	});

	it('Check navigation to register page', () => {
		cy.get('nav').contains('Register').click();
		cy.contains('h3', 'Registration');
		cy.go('back');
		cy.contains('h3', 'Log-In');
		cy.wait(1000);
		cy.get('#login-form').contains('Register').click();
		cy.contains('h3', 'Registration');
		cy.go('back');
		cy.contains('h3', 'Log-In');
	});

	it('Proceed to log in', () => {
		cy.get('#email').type('cypresstest@gmail.com');
		cy.get('#password').type('CypressTest!2');
		cy.get('button').contains('Log-In').click();
		cy.url().should('include', '/home');
		cy.wait(1000);
	});
});
