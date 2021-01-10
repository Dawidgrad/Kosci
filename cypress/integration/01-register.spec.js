/// <reference types="cypress" />

describe('Cypress register testing', () => {
	it('Visit register page', () => {
		// Navigate to registration page and image snapshot test it
		cy.visit('/register').then(() => {
			cy.wait(1000);
			cy.document().toMatchImageSnapshot({
				imageConfig: {
					threshold: 0.01,
					thresholdType: 'percent',
				},
				name: 'RegistrationPage',
			});
		});

		cy.contains('h3', 'Registration');
		cy.get('nav').contains('Log-in');
		cy.get('nav').contains('Register');
		cy.get('nav').contains('Kosci');
	});

	it('Check navigation to login page', () => {
		cy.get('nav').contains('Log-in').click();
		cy.contains('h3', 'Log-In');
		cy.go('back');
		cy.contains('h3', 'Registration');
		cy.wait(1000);
		cy.get('#register-form').contains('Cancel').click();
		cy.contains('h3', 'Log-In');
		cy.go('back');
		cy.contains('h3', 'Registration');
	});

	it('Proceed to register', () => {
		cy.get('#nickname').type('CypressTest');
		cy.get('#email').type('cypresstest@gmail.com');
		cy.get('#password').type('CypressTest!2');
		cy.get('#confirm').type('CypressTest!2');
		cy.get('button').contains('Submit').click();

		cy.contains('User successfully added!');
		cy.wait(1000);
	});
});
