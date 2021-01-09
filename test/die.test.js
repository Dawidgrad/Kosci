const Die = require('../game-logic/die.js').Die;
const chai = require('chai');
const expect = require('chai').expect;

describe('Die model tests', () => {
	before(() => {
		this.die = new Die();
	});

	it('Rolling die', () => {
		this.die.roll();
		const isInRange = this.die.side >= 1 && this.die.side <= 6;

		expect(isInRange).to.be.true;
	});

	it('Generating position', () => {
		this.die.generatePosition();
		const xIsInRange = this.die.x >= 0 && this.die.x <= 400;
		const yIsInRange = this.die.y >= 0 && this.die.y <= 400;

		expect(xIsInRange).to.be.true;
		expect(yIsInRange).to.be.true;
	});
});
