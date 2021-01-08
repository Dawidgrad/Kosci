const rollingFile = require('../../game-logic/rolling-system');
const Die = require('../../game-logic/die').Die;

describe('Rolling system tests', () => {
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

	test('Re-rolling dice', () => {
		const initialRoll = [];
		let roll = [];
		const diceToRoll = [0, 2, 4];
		for (let i = 0; i < 5; i++) {
			initialRoll.push(new Die());
			roll.push(initialRoll[i]);
		}

		roll = this.rollingSystem.reroll(roll, diceToRoll);

		expect(initialRoll[0]).not.toStrictEqual(roll[0]);
		expect(initialRoll[1]).toStrictEqual(roll[1]);
		expect(initialRoll[2]).not.toStrictEqual(roll[2]);
		expect(initialRoll[3]).toStrictEqual(roll[3]);
		expect(initialRoll[4]).not.toStrictEqual(roll[4]);
	});

	test('Separating dice', () => {
		let dice = [
			{ side: 2, x: 150, y: 200 },
			{ side: 3, x: 150, y: 200 },
			{ side: 2, x: 50, y: 50 },
		];

		dice = this.rollingSystem.separateDice(dice);

		expect(dice[0].x).not.toBe(dice[1].x);
		expect(dice[0].y).not.toBe(dice[1].y);
	});

	test('Separating selected dice', () => {
		let dice = [
			{ side: 2, x: 150, y: 200 },
			{ side: 3, x: 150, y: 200 },
			{ side: 2, x: 50, y: 50 },
		];

		const initialDice = [
			{ side: 2, x: 150, y: 200 },
			{ side: 3, x: 150, y: 200 },
			{ side: 2, x: 50, y: 50 },
		];

		dice = this.rollingSystem.separateSelectedDice(dice, [0, 1]);

		expect(dice[0].x).not.toBe(dice[1].x);
		expect(dice[0].y).not.toBe(dice[1].y);
		expect(initialDice[3]).toStrictEqual(dice[3]);
	});

	[
		{ dieA: { x: 250, y: 200 }, dieB: { x: 270, y: 180 }, expected: false },
		{ dieA: { x: 300, y: 300 }, dieB: { x: 50, y: 50 }, expected: true },
		{ dieA: { x: 150, y: 400 }, dieB: { x: 210, y: 460 }, expected: false },
		{ dieA: { x: 20, y: 150 }, dieB: { x: 150, y: 20 }, expected: true },
	].map(({ dieA, dieB, expected }) => {
		test('Checking intersection', () => {
			const result = this.rollingSystem.checkIntersection(dieA, dieB);
			const isNull = result === null;

			expect(isNull).toBe(expected);
		});
	});
});
