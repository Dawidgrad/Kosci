const gameFile = require('../game-logic/game-system');
const Die = require('../game-logic/die').Die;
const chai = require('chai');
const expect = require('chai').expect;

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

	it('Starting the game', () => {
		expect(this.gameSystem.currentRoll.length).to.be.equal(5);

		for (const dice in this.gameSystem.currentRoll) {
			expect(this.gameSystem.currentRoll[dice] instanceof Die).to.be.true;
		}

		expect(this.gameSystem.currentPlayer.nickname).to.be.equal('Tom');
		expect(this.gameSystem.roundCount).to.be.equal(1);
		expect(this.gameSystem.rollsLeft).to.be.equal(2);
	});

	it('Rerolling the dice', () => {
		const initialRoll = [];
		const diceToRoll = [0, 2, 4];
		for (const item in this.gameSystem.currentRoll) {
			initialRoll.push(this.gameSystem.currentRoll[item]);
		}

		this.gameSystem.reroll(diceToRoll);

		expect(initialRoll[0]).to.not.deep.equal(this.gameSystem.currentRoll[0]);
		expect(initialRoll[1]).to.deep.equal(this.gameSystem.currentRoll[1]);
		expect(initialRoll[2]).to.not.deep.equal(this.gameSystem.currentRoll[2]);
		expect(initialRoll[3]).to.deep.equal(this.gameSystem.currentRoll[3]);
		expect(initialRoll[4]).to.not.deep.equal(this.gameSystem.currentRoll[4]);
	});

	['ones', 'pair', 'kosci', 'chance'].map((row) => {
		it('Submitting roll', () => {
			this.gameSystem.submitRoll(row);
			expect(this.gameSystem.scoreboards[0].scores[row]).to.not.be.null;
			expect(this.gameSystem.currentPlayer.nickname).to.equal('Emma');
		});
	});

	it('Getting game state', () => {
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

		expect(expected.currentPlayer).to.deep.equal(result.currentPlayer);
		expect(expected.gameEnded).to.equal(result.gameEnded);
		expect(expected.rollsLeft).to.equal(result.rollsLeft);
		expect(expected.roundCount).to.equal(result.roundCount);
		expect(expected.winner).to.equal(result.winner);
	});

	it('Switching to next player', () => {
		const previousRoll = this.gameSystem.currentRoll;

		this.gameSystem.nextPlayer();

		expect(this.gameSystem.rollsLeft).to.equal(2);
		expect(this.gameSystem.currentPlayer.nickname).to.equal('Emma');
		expect(this.gameSystem.currentRoll).to.not.deep.equal(previousRoll);
	});

	it('Switching to next round', () => {
		const currentRound = this.gameSystem.roundCount;

		this.gameSystem.nextRound();

		expect(this.gameSystem.roundCount).to.equal(currentRound + 1);
	});

	[
		{ index: 0, winner: 'Tom' },
		{ index: 1, winner: 'Emma' },
		{ index: 2, winner: 'Gareth' },
		{ index: 3, winner: 'Claire' },
	].map(({ index, winner }) => {
		it('Finishing the game', () => {
			this.gameSystem.scoreboards[index].scores.kosci = 50;
			this.gameSystem.finishGame();

			expect(this.gameSystem.gameEnded).to.be.true;
			expect(this.gameSystem.winner).to.equal(winner);
		});
	});
});
