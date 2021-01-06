const gameFile = require('../game-system.js');
const Die = require('../die.js').Die;

describe('Game system tests', () => {
	beforeEach(() => {
		const participants = [
			{ nickname: 'Tom' },
			{ nickname: 'Emma' },
			{ nickname: 'Gareth' },
			{ nickname: 'Claire' },
		];
		const name = '8abd290c';
		this.gameSystem = new gameFile.GameSystem(name, participants);
		this.gameSystem.start();
	});

	test('Starting the game', () => {
		expect(this.gameSystem.currentRoll.length).toBe(5);

		for (const dice in this.gameSystem.currentRoll) {
			expect(this.gameSystem.currentRoll[dice] instanceof Die).toBe(true);
		}

		expect(this.gameSystem.currentPlayer.nickname).toBe('Tom');
		expect(this.gameSystem.roundCount).toBe(1);
		expect(this.gameSystem.rollsLeft).toBe(2);
	});

	test('Rerolling the dice', () => {
		const initialRoll = [];
		const diceToRoll = [0, 2, 4];
		for (const item in this.gameSystem.currentRoll) {
			initialRoll.push(this.gameSystem.currentRoll[item]);
		}

		this.gameSystem.reroll(diceToRoll);

		expect(initialRoll[0]).not.toStrictEqual(this.gameSystem.currentRoll[0]);
		expect(initialRoll[1]).toStrictEqual(this.gameSystem.currentRoll[1]);
		expect(initialRoll[2]).not.toStrictEqual(this.gameSystem.currentRoll[2]);
		expect(initialRoll[3]).toStrictEqual(this.gameSystem.currentRoll[3]);
		expect(initialRoll[4]).not.toStrictEqual(this.gameSystem.currentRoll[4]);
	});

	['ones', 'pair', 'kosci', 'chance'].map((row) => {
		test('Submitting roll', () => {
			this.gameSystem.submitRoll(row);
			expect(this.gameSystem.scoreboards[0].scores[row]).not.toBe(null);
			expect(this.gameSystem.currentPlayer.nickname).toBe('Emma');
		});
	});

	test('Getting game state', () => {
		const expected = {
			currentPlayer: {
				id: undefined,
				nickname: 'Tom',
			},
			gameEnded: false,
			rollsLeft: 2,
			roundCount: 1,
			winner: '',
		};

		const result = this.gameSystem.getGameState();

		expect(expected.currentPlayer).toEqual(result.currentPlayer);
		expect(expected.gameEnded).toBe(result.gameEnded);
		expect(expected.rollsLeft).toBe(result.rollsLeft);
		expect(expected.roundCount).toBe(result.roundCount);
		expect(expected.winner).toBe(result.winner);
	});

	test('Switching to next player', () => {
		const previousRoll = this.gameSystem.currentRoll;

		this.gameSystem.nextPlayer();

		expect(this.gameSystem.rollsLeft).toBe(2);
		expect(this.gameSystem.currentPlayer.nickname).toBe('Emma');
		expect(this.gameSystem.currentRoll).not.toStrictEqual(previousRoll);
	});

	test('Switching to next round', () => {
		const currentRound = this.gameSystem.roundCount;

		this.gameSystem.nextRound();

		expect(this.gameSystem.roundCount).toBe(currentRound + 1);
	});

	[
		{ index: 0, winner: 'Tom' },
		{ index: 1, winner: 'Emma' },
		{ index: 2, winner: 'Gareth' },
		{ index: 3, winner: 'Claire' },
	].map(({ index, winner }) => {
		test('Finishing the game', () => {
			this.gameSystem.scoreboards[index].scores.kosci = 50;
			this.gameSystem.finishGame();

			expect(this.gameSystem.gameEnded).toEqual(true);
			expect(this.gameSystem.winner).toBe(winner);
		});
	});
});
