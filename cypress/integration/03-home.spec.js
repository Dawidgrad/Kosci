/// <reference types="cypress" />

describe('Cypress home testing', () => {
	it('Test home page', () => {
		// Log in
		cy.visit('/login');
		cy.get('#email').type('cypresstest@gmail.com');
		cy.get('#password').type('CypressTest!2');
		cy.get('button')
			.contains('Log-In')
			.click();

		cy.url().should('include', '/home');

		// Check the state of elements
		cy.get('nav').contains('Home');
		cy.get('nav').contains('Profile');
		cy.get('nav').contains('Log-out');
		cy.get('nav').contains('Kosci');

		cy.contains('h2', 'How to play');
		cy.contains('h2', 'Available rooms');
		cy.get('#previousButton').should('be.disabled');
		cy.wait(1000);
	});
});
