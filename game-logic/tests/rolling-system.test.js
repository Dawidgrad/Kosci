const rollingFile = require('../rolling-system.js');
const Die = require('../die.js').Die;

describe('Scoring system tests', () => {
	beforeAll(() => {
		this.rollingSystem = new rollingFile.RollingSystem();
	});

	test('Rolling new dice', () => {
		const roll = this.rollingSystem.newRoll();
		expect(roll.length).toBe(5);
		for (const dice in roll) {
			expect(roll[dice] instanceof Die).toBe(true);
		}
	});
});
