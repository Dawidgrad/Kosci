const Scoreboard = require('../game-logic/scoreboard').Scoreboard;
const chai = require('chai');
const expect = require('chai').expect;

describe('Scoreboard model tests', () => {
	it('Updating scores', () => {
		const scoreboard = new Scoreboard();

		const expectedScores = {
			ones: 3,
			twos: 6,
			threes: 9,
			fours: 12,
			fives: 15,
			sixes: 18,
			pair: 12,
			twoPairs: 22,
			smallStraight: 15,
			largeStraight: 20,
			threeKind: 15,
			fullHouse: 21,
			fourKind: 41,
			kosci: 60,
			chance: 30,
		};
		const expectedFinal = 299;

		scoreboard.updateScoreboard(expectedScores, expectedFinal);

		expect(scoreboard.scores).to.deep.equal(expectedScores);
		expect(scoreboard.finalScore).to.equal(expectedFinal);
	});
});
