const scoringFile = require('../scoring-system.js');

describe('Scoring system tests', () => {
	test('Selecting strategy', () => {
		const scoringSystem = new scoringFile.ScoringSystem();
		scoringSystem.selectStrategy('smallStraight');
		const strategy = scoringSystem.strategy;
		expect(strategy instanceof scoringFile.SmallStraight).toBe(true);
	});

	[
		{ roll: [{ side: 5 }, { side: 3 }, { side: 3 }, { side: 5 }, { side: 4 }], expected: [0, 0, 2, 1, 2, 0] },
		{ roll: [{ side: 1 }, { side: 1 }, { side: 1 }, { side: 5 }, { side: 1 }], expected: [4, 0, 0, 0, 1, 0] },
		{ roll: [{ side: 6 }, { side: 2 }, { side: 5 }, { side: 4 }, { side: 3 }], expected: [0, 1, 1, 1, 1, 1] },
	].map(({ roll, expected }) => {
		test('Getting frequency array', () => {
			const result = scoringFile.getFrequencyArray(roll);
			expect(result).toStrictEqual(expected);
		});
	});

	[
		{ roll: [{ side: 1 }, { side: 1 }, { side: 3 }, { side: 5 }, { side: 4 }], expected: 2 },
		{ roll: [{ side: 5 }, { side: 1 }, { side: 1 }, { side: 5 }, { side: 1 }], expected: 3 },
		{ roll: [{ side: 5 }, { side: 2 }, { side: 6 }, { side: 3 }, { side: 6 }], expected: 0 },
	].map(({ roll, expected }) => {
		test('Calculate score - Ones', () => {
			const ones = new scoringFile.Ones();
			const result = ones.calculateScore(roll);
			expect(result).toBe(expected);
		});
	});

	[
		{ roll: [{ side: 1 }, { side: 2 }, { side: 3 }, { side: 5 }, { side: 2 }], expected: 4 },
		{ roll: [{ side: 2 }, { side: 2 }, { side: 2 }, { side: 2 }, { side: 2 }], expected: 10 },
		{ roll: [{ side: 5 }, { side: 3 }, { side: 6 }, { side: 3 }, { side: 6 }], expected: 0 },
	].map(({ roll, expected }) => {
		test('Calculate score - Twos', () => {
			const twos = new scoringFile.Twos();
			const result = twos.calculateScore(roll);
			expect(result).toBe(expected);
		});
	});

	[
		{ roll: [{ side: 3 }, { side: 1 }, { side: 3 }, { side: 5 }, { side: 3 }], expected: 9 },
		{ roll: [{ side: 3 }, { side: 3 }, { side: 3 }, { side: 3 }, { side: 3 }], expected: 15 },
		{ roll: [{ side: 6 }, { side: 6 }, { side: 6 }, { side: 1 }, { side: 1 }], expected: 0 },
	].map(({ roll, expected }) => {
		test('Calculate score - Threes', () => {
			const threes = new scoringFile.Threes();
			const result = threes.calculateScore(roll);
			expect(result).toBe(expected);
		});
	});

	[
		{ roll: [{ side: 4 }, { side: 2 }, { side: 3 }, { side: 4 }, { side: 6 }], expected: 8 },
		{ roll: [{ side: 4 }, { side: 4 }, { side: 4 }, { side: 4 }, { side: 4 }], expected: 20 },
		{ roll: [{ side: 1 }, { side: 2 }, { side: 3 }, { side: 6 }, { side: 5 }], expected: 0 },
	].map(({ roll, expected }) => {
		test('Calculate score - Fours', () => {
			const fours = new scoringFile.Fours();
			const result = fours.calculateScore(roll);
			expect(result).toBe(expected);
		});
	});

	[
		{ roll: [{ side: 4 }, { side: 1 }, { side: 1 }, { side: 5 }, { side: 5 }], expected: 10 },
		{ roll: [{ side: 5 }, { side: 5 }, { side: 5 }, { side: 5 }, { side: 5 }], expected: 25 },
		{ roll: [{ side: 3 }, { side: 3 }, { side: 2 }, { side: 2 }, { side: 4 }], expected: 0 },
	].map(({ roll, expected }) => {
		test('Calculate score - Fives', () => {
			const fives = new scoringFile.Fives();
			const result = fives.calculateScore(roll);
			expect(result).toBe(expected);
		});
	});

	[
		{ roll: [{ side: 6 }, { side: 1 }, { side: 1 }, { side: 6 }, { side: 2 }], expected: 12 },
		{ roll: [{ side: 6 }, { side: 6 }, { side: 6 }, { side: 6 }, { side: 6 }], expected: 30 },
		{ roll: [{ side: 3 }, { side: 5 }, { side: 2 }, { side: 1 }, { side: 4 }], expected: 0 },
	].map(({ roll, expected }) => {
		test('Calculate score - Sixes', () => {
			const sixes = new scoringFile.Sixes();
			const result = sixes.calculateScore(roll);
			expect(result).toBe(expected);
		});
	});
});
