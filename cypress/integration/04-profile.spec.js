/// <reference types="cypress" />

describe('Cypress profile testing', () => {
	it('Test profile page', () => {
		// Navigate to profile page
		cy.visit('/login');
		cy.get('#email').type('cypresstest@gmail.com');
		cy.get('#password').type('CypressTest!2');
		cy.get('button').contains('Log-In').click();

		cy.get('nav').contains('Profile').click();
		cy.contains('h2', 'Profile settings');

		// Check the elements
		cy.get('nav').contains('Home');
		cy.get('nav').contains('Profile');
		cy.get('nav').contains('Log-out');
		cy.get('nav').contains('Kosci');

		cy.contains('Nickname: CypressTest');
		cy.contains('Wins: 0');

		// Change password
		cy.get('#oldPassword').type('CypressTest!2');
		cy.get('#newPassword').type('CypressTestNew5)');
		cy.get('#confirm').type('CypressTestNew5)');
		cy.get('#passwordForm').contains('Change').click();

		cy.contains('Password changed!');
		cy.wait(1000);

		// Change email
		cy.get('#oldEmail').type('cypresstest@gmail.com');
		cy.get('#newEmail').type('cypresstestnew@gmail.com');
		cy.get('#emailForm').contains('Change').click();

		cy.contains('Email changed!');
		cy.wait(1000);

		// Change nickname
		cy.get('#newNickname').type('CypressTestNew');
		cy.get('#nicknameForm').contains('Change').click();

		cy.contains('Nickname changed! Re-log to apply the changes.');
		cy.wait(1000);

		// Logout
		cy.get('nav').contains('Log-out').click();

		// Login with new credentials
		cy.get('#email').type('cypresstestnew@gmail.com');
		cy.get('#password').type('CypressTestNew5)');
		cy.get('button').contains('Log-In').click();
		cy.wait(1000);

		// Navigate to profile page
		cy.get('nav').contains('Profile').click();

		// Delete the account
		cy.get('#deleteUser').click();
	});
});
