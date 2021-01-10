/// <reference types="cypress" />

describe('Cypress home testing', () => {
	// Single test due to session
	it('Test home page', () => {
		// Login
		cy.visit('/login');
		cy.get('#email').type('cypresstest@gmail.com');
		cy.get('#password').type('CypressTest!2');
		cy.get('button')
			.contains('Log-In')
			.click();

		cy.url().should('include', '/home');

		// Create new room
		cy.get('#createRoom').click();

		// Image snapshot test
		cy.wait(1000);
		cy.document().toMatchImageSnapshot({
			imageConfig: {
				threshold: 0.01,
				thresholdType: 'percent',
			},
			name: 'GamePage',
		});

		// Check the state of elements
		cy.get('nav').contains('Home');
		cy.get('nav').contains('Profile');
		cy.get('nav').contains('Log-out');
		cy.get('nav').contains('Kosci');

		cy.get('#startGame');
		cy.get('#rollDice').should('not.be.visible');
		cy.get('#game-state');
		cy.get('#game-canvas').should('not.be.visible');
		cy.get('#scoreboard').should('not.be.visible');
		cy.get('.score-submission').should('not.be.visible');
		cy.get('#chat-box');
		cy.get('#chat-message');

		cy.wait(1000);
	});
});
