const scoringFile = require('../game-logic/scoring-system');
const chai = require('chai');
const expect = require('chai').expect;

describe('Scoring system tests', () => {
	it('Selecting strategy', () => {
		const scoringSystem = new scoringFile.ScoringSystem();
		scoringSystem.selectStrategy('smallStraight');
		const strategy = scoringSystem.strategy;
		expect(strategy instanceof scoringFile.SmallStraight).to.be.true;
	});

	[
		{ roll: [{ side: 5 }, { side: 3 }, { side: 3 }, { side: 5 }, { side: 4 }], expected: [0, 0, 2, 1, 2, 0] },
		{ roll: [{ side: 1 }, { side: 1 }, { side: 1 }, { side: 5 }, { side: 1 }], expected: [4, 0, 0, 0, 1, 0] },
		{ roll: [{ side: 6 }, { side: 2 }, { side: 5 }, { side: 4 }, { side: 3 }], expected: [0, 1, 1, 1, 1, 1] },
	].map(({ roll, expected }) => {
		it('Getting frequency array', () => {
			const result = scoringFile.getFrequencyArray(roll);
			expect(result).to.deep.equal(expected);
		});
	});

	[
		{ roll: [{ side: 1 }, { side: 1 }, { side: 3 }, { side: 5 }, { side: 4 }], expected: 2 },
		{ roll: [{ side: 5 }, { side: 1 }, { side: 1 }, { side: 5 }, { side: 1 }], expected: 3 },
		{ roll: [{ side: 5 }, { side: 2 }, { side: 6 }, { side: 3 }, { side: 6 }], expected: 0 },
	].map(({ roll, expected }) => {
		it('Calculate score - Ones', () => {
			const ones = new scoringFile.Ones();
			const result = ones.calculateScore(roll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 1 }, { side: 2 }, { side: 3 }, { side: 5 }, { side: 2 }], expected: 4 },
		{ roll: [{ side: 2 }, { side: 2 }, { side: 2 }, { side: 2 }, { side: 2 }], expected: 10 },
		{ roll: [{ side: 5 }, { side: 3 }, { side: 6 }, { side: 3 }, { side: 6 }], expected: 0 },
	].map(({ roll, expected }) => {
		it('Calculate score - Twos', () => {
			const twos = new scoringFile.Twos();
			const result = twos.calculateScore(roll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 3 }, { side: 1 }, { side: 3 }, { side: 5 }, { side: 3 }], expected: 9 },
		{ roll: [{ side: 3 }, { side: 3 }, { side: 3 }, { side: 3 }, { side: 3 }], expected: 15 },
		{ roll: [{ side: 6 }, { side: 6 }, { side: 6 }, { side: 1 }, { side: 1 }], expected: 0 },
	].map(({ roll, expected }) => {
		it('Calculate score - Threes', () => {
			const threes = new scoringFile.Threes();
			const result = threes.calculateScore(roll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 4 }, { side: 2 }, { side: 3 }, { side: 4 }, { side: 6 }], expected: 8 },
		{ roll: [{ side: 4 }, { side: 4 }, { side: 4 }, { side: 4 }, { side: 4 }], expected: 20 },
		{ roll: [{ side: 1 }, { side: 2 }, { side: 3 }, { side: 6 }, { side: 5 }], expected: 0 },
	].map(({ roll, expected }) => {
		it('Calculate score - Fours', () => {
			const fours = new scoringFile.Fours();
			const result = fours.calculateScore(roll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 4 }, { side: 1 }, { side: 1 }, { side: 5 }, { side: 5 }], expected: 10 },
		{ roll: [{ side: 5 }, { side: 5 }, { side: 5 }, { side: 5 }, { side: 5 }], expected: 25 },
		{ roll: [{ side: 3 }, { side: 3 }, { side: 2 }, { side: 2 }, { side: 4 }], expected: 0 },
	].map(({ roll, expected }) => {
		it('Calculate score - Fives', () => {
			const fives = new scoringFile.Fives();
			const result = fives.calculateScore(roll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 6 }, { side: 1 }, { side: 1 }, { side: 6 }, { side: 2 }], expected: 12 },
		{ roll: [{ side: 6 }, { side: 6 }, { side: 6 }, { side: 6 }, { side: 6 }], expected: 30 },
		{ roll: [{ side: 3 }, { side: 5 }, { side: 2 }, { side: 1 }, { side: 4 }], expected: 0 },
	].map(({ roll, expected }) => {
		it('Calculate score - Sixes', () => {
			const sixes = new scoringFile.Sixes();
			const result = sixes.calculateScore(roll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 6 }, { side: 1 }, { side: 6 }, { side: 6 }, { side: 2 }], expected: 24, firstRoll: true },
		{ roll: [{ side: 3 }, { side: 1 }, { side: 2 }, { side: 6 }, { side: 4 }], expected: 0, firstRoll: true },
		{ roll: [{ side: 1 }, { side: 4 }, { side: 1 }, { side: 4 }, { side: 3 }], expected: 8, firstRoll: false },
		{ roll: [{ side: 5 }, { side: 2 }, { side: 1 }, { side: 3 }, { side: 4 }], expected: 0, firstRoll: false },
	].map(({ roll, expected, firstRoll }) => {
		it('Calculate score - Pair', () => {
			const pair = new scoringFile.Pair();
			const result = pair.calculateScore(roll, firstRoll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 6 }, { side: 1 }, { side: 6 }, { side: 1 }, { side: 2 }], expected: 28, firstRoll: true },
		{ roll: [{ side: 4 }, { side: 1 }, { side: 2 }, { side: 6 }, { side: 4 }], expected: 0, firstRoll: true },
		{ roll: [{ side: 5 }, { side: 4 }, { side: 5 }, { side: 4 }, { side: 3 }], expected: 18, firstRoll: false },
		{ roll: [{ side: 5 }, { side: 2 }, { side: 1 }, { side: 3 }, { side: 4 }], expected: 0, firstRoll: false },
	].map(({ roll, expected, firstRoll }) => {
		it('Calculate score - Two Pairs', () => {
			const twoPairs = new scoringFile.TwoPairs();
			const result = twoPairs.calculateScore(roll, firstRoll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 5 }, { side: 1 }, { side: 4 }, { side: 3 }, { side: 2 }], expected: 30, firstRoll: true },
		{ roll: [{ side: 2 }, { side: 4 }, { side: 5 }, { side: 6 }, { side: 3 }], expected: 0, firstRoll: true },
		{ roll: [{ side: 5 }, { side: 4 }, { side: 1 }, { side: 2 }, { side: 3 }], expected: 15, firstRoll: false },
		{ roll: [{ side: 5 }, { side: 1 }, { side: 1 }, { side: 3 }, { side: 4 }], expected: 0, firstRoll: false },
	].map(({ roll, expected, firstRoll }) => {
		it('Calculate score - Small Straight', () => {
			const smallStraight = new scoringFile.SmallStraight();
			const result = smallStraight.calculateScore(roll, firstRoll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 5 }, { side: 6 }, { side: 4 }, { side: 3 }, { side: 2 }], expected: 40, firstRoll: true },
		{ roll: [{ side: 2 }, { side: 4 }, { side: 5 }, { side: 1 }, { side: 3 }], expected: 0, firstRoll: true },
		{ roll: [{ side: 5 }, { side: 4 }, { side: 6 }, { side: 2 }, { side: 3 }], expected: 20, firstRoll: false },
		{ roll: [{ side: 5 }, { side: 5 }, { side: 3 }, { side: 3 }, { side: 5 }], expected: 0, firstRoll: false },
	].map(({ roll, expected, firstRoll }) => {
		it('Calculate score - Large Straight', () => {
			const largeStraight = new scoringFile.LargeStraight();
			const result = largeStraight.calculateScore(roll, firstRoll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 5 }, { side: 5 }, { side: 2 }, { side: 3 }, { side: 5 }], expected: 30, firstRoll: true },
		{ roll: [{ side: 2 }, { side: 4 }, { side: 5 }, { side: 1 }, { side: 3 }], expected: 0, firstRoll: true },
		{ roll: [{ side: 2 }, { side: 1 }, { side: 2 }, { side: 2 }, { side: 3 }], expected: 6, firstRoll: false },
		{ roll: [{ side: 6 }, { side: 6 }, { side: 3 }, { side: 3 }, { side: 5 }], expected: 0, firstRoll: false },
	].map(({ roll, expected, firstRoll }) => {
		it('Calculate score - Three of a kind', () => {
			const threeOfKind = new scoringFile.ThreeOfKind();
			const result = threeOfKind.calculateScore(roll, firstRoll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 1 }, { side: 3 }, { side: 1 }, { side: 3 }, { side: 3 }], expected: 22, firstRoll: true },
		{ roll: [{ side: 2 }, { side: 1 }, { side: 5 }, { side: 1 }, { side: 3 }], expected: 0, firstRoll: true },
		{ roll: [{ side: 2 }, { side: 6 }, { side: 2 }, { side: 2 }, { side: 6 }], expected: 18, firstRoll: false },
		{ roll: [{ side: 6 }, { side: 1 }, { side: 3 }, { side: 3 }, { side: 5 }], expected: 0, firstRoll: false },
	].map(({ roll, expected, firstRoll }) => {
		it('Calculate score - Full House', () => {
			const fullHouse = new scoringFile.FullHouse();
			const result = fullHouse.calculateScore(roll, firstRoll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 3 }, { side: 3 }, { side: 1 }, { side: 3 }, { side: 3 }], expected: 49, firstRoll: true },
		{ roll: [{ side: 4 }, { side: 4 }, { side: 5 }, { side: 1 }, { side: 4 }], expected: 0, firstRoll: true },
		{ roll: [{ side: 6 }, { side: 6 }, { side: 6 }, { side: 2 }, { side: 6 }], expected: 49, firstRoll: false },
		{ roll: [{ side: 6 }, { side: 1 }, { side: 3 }, { side: 3 }, { side: 5 }], expected: 0, firstRoll: false },
	].map(({ roll, expected, firstRoll }) => {
		it('Calculate score - Four of a kind', () => {
			const fourOfKind = new scoringFile.FourOfKind();
			const result = fourOfKind.calculateScore(roll, firstRoll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 3 }, { side: 3 }, { side: 3 }, { side: 3 }, { side: 3 }], expected: 80, firstRoll: true },
		{ roll: [{ side: 4 }, { side: 4 }, { side: 5 }, { side: 4 }, { side: 4 }], expected: 0, firstRoll: true },
		{ roll: [{ side: 5 }, { side: 5 }, { side: 5 }, { side: 5 }, { side: 5 }], expected: 75, firstRoll: false },
		{ roll: [{ side: 6 }, { side: 1 }, { side: 3 }, { side: 3 }, { side: 5 }], expected: 0, firstRoll: false },
	].map(({ roll, expected, firstRoll }) => {
		it('Calculate score - Kosci', () => {
			const kosci = new scoringFile.Kosci();
			const result = kosci.calculateScore(roll, firstRoll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 6 }, { side: 4 }, { side: 4 }, { side: 3 }, { side: 3 }], expected: 40, firstRoll: true },
		{ roll: [{ side: 2 }, { side: 2 }, { side: 5 }, { side: 4 }, { side: 6 }], expected: 38, firstRoll: true },
		{ roll: [{ side: 1 }, { side: 3 }, { side: 4 }, { side: 5 }, { side: 2 }], expected: 15, firstRoll: false },
		{ roll: [{ side: 6 }, { side: 6 }, { side: 3 }, { side: 6 }, { side: 6 }], expected: 27, firstRoll: false },
	].map(({ roll, expected, firstRoll }) => {
		it('Calculate score - Chance', () => {
			const chance = new scoringFile.Chance();
			const result = chance.calculateScore(roll, firstRoll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 3 }, { side: 1 }, { side: 5 }, { side: 5 }, { side: 2 }], expected: true },
		{ roll: [{ side: 5 }, { side: 1 }, { side: 2 }, { side: 6 }, { side: 4 }], expected: false },
	].map(({ roll, expected }) => {
		it('Validate - Pair', () => {
			const pair = new scoringFile.Pair();
			const result = pair.validateCombination(roll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 3 }, { side: 1 }, { side: 5 }, { side: 5 }, { side: 1 }], expected: true },
		{ roll: [{ side: 4 }, { side: 3 }, { side: 2 }, { side: 6 }, { side: 4 }], expected: false },
	].map(({ roll, expected }) => {
		it('Validate - Two Pairs', () => {
			const twoPairs = new scoringFile.TwoPairs();
			const result = twoPairs.validateCombination(roll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 1 }, { side: 2 }, { side: 3 }, { side: 4 }, { side: 5 }], expected: true },
		{ roll: [{ side: 2 }, { side: 2 }, { side: 5 }, { side: 4 }, { side: 3 }], expected: false },
	].map(({ roll, expected }) => {
		it('Validate - Small Straight', () => {
			const smallStraight = new scoringFile.SmallStraight();
			const result = smallStraight.validateCombination(roll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 3 }, { side: 2 }, { side: 6 }, { side: 4 }, { side: 5 }], expected: true },
		{ roll: [{ side: 2 }, { side: 1 }, { side: 5 }, { side: 6 }, { side: 3 }], expected: false },
	].map(({ roll, expected }) => {
		it('Validate - Large Straight', () => {
			const largeStraight = new scoringFile.LargeStraight();
			const result = largeStraight.validateCombination(roll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 3 }, { side: 4 }, { side: 4 }, { side: 4 }, { side: 5 }], expected: true },
		{ roll: [{ side: 2 }, { side: 2 }, { side: 5 }, { side: 6 }, { side: 3 }], expected: false },
	].map(({ roll, expected }) => {
		it('Validate - Three of a kind', () => {
			const threeOfKind = new scoringFile.ThreeOfKind();
			const result = threeOfKind.validateCombination(roll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 3 }, { side: 4 }, { side: 4 }, { side: 4 }, { side: 3 }], expected: true },
		{ roll: [{ side: 2 }, { side: 3 }, { side: 6 }, { side: 6 }, { side: 3 }], expected: false },
	].map(({ roll, expected }) => {
		it('Validate - Full House', () => {
			const fullHouse = new scoringFile.FullHouse();
			const result = fullHouse.validateCombination(roll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 3 }, { side: 2 }, { side: 2 }, { side: 2 }, { side: 2 }], expected: true },
		{ roll: [{ side: 6 }, { side: 6 }, { side: 6 }, { side: 1 }, { side: 3 }], expected: false },
	].map(({ roll, expected }) => {
		it('Validate - Four of a kind', () => {
			const fourOfKind = new scoringFile.FourOfKind();
			const result = fourOfKind.validateCombination(roll);
			expect(result).to.equal(expected);
		});
	});

	[
		{ roll: [{ side: 1 }, { side: 1 }, { side: 1 }, { side: 1 }, { side: 1 }], expected: true },
		{ roll: [{ side: 5 }, { side: 1 }, { side: 5 }, { side: 1 }, { side: 5 }], expected: false },
	].map(({ roll, expected }) => {
		it('Validate - Kosci', () => {
			const kosci = new scoringFile.Kosci();
			const result = kosci.validateCombination(roll);
			expect(result).to.equal(expected);
		});
	});
});
