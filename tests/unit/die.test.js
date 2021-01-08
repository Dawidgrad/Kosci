const Die = require('../../game-logic/die.js').Die;

describe('Die model tests', () => {
	beforeAll(() => {
		this.die = new Die();
	});

	test('Rolling die', () => {
		this.die.roll();
		const isInRange = this.die.side >= 1 && this.die.side <= 6;

		expect(isInRange).toBe(true);
	});

	test('Generating position', () => {
		this.die.generatePosition();
		const xIsInRange = this.die.x >= 0 && this.die.x <= 400;
		const yIsInRange = this.die.y >= 0 && this.die.y <= 400;

		expect(xIsInRange).toBe(true);
		expect(yIsInRange).toBe(true);
	});
});
