class ScoringSystem {
	constructor() {}

	calculateScore(strategy, roll, firstRoll) {
		this.selectStrategy(strategy);
		return this.strategy.calculateScore(roll, firstRoll);
	}

	getFinalScore(scores) {
		let finalScore = 0;
		const upperSectionBonus =
			scores.ones + scores.twos + scores.threes + scores.fours + scores.fives + scores.sixes >= 63 ? 50 : 0;
		const lowerSectionBonus =
			scores.pair !== 0 &&
			scores.twoPairs !== 0 &&
			scores.smallStraight !== 0 &&
			scores.largeStraight !== 0 &&
			scores.threeKind !== 0 &&
			scores.fullHouse !== 0 &&
			scores.fourKind !== 0 &&
			scores.kosci !== 0 &&
			scores.chance !== 0
				? 100
				: 0;

		Object.keys(scores).forEach((key, index) => {
			finalScore += scores[key];
		});

		return finalScore + lowerSectionBonus + upperSectionBonus;
	}

	selectStrategy(strategy) {
		switch (strategy) {
			case 'ones':
				this.strategy = new Ones();
				break;
			case 'twos':
				this.strategy = new Twos();
				break;
			case 'threes':
				this.strategy = new Threes();
				break;
			case 'fours':
				this.strategy = new Fours();
				break;
			case 'fives':
				this.strategy = new Fives();
				break;
			case 'sixes':
				this.strategy = new Sixes();
				break;
			case 'pair':
				this.strategy = new Pair();
				break;
			case 'twoPairs':
				this.strategy = new TwoPairs();
				break;
			case 'smallStraight':
				this.strategy = new SmallStraight();
				break;
			case 'largeStraight':
				this.strategy = new LargeStraight();
				break;
			case 'threeKind':
				this.strategy = new ThreeOfKind();
				break;
			case 'fullHouse':
				this.strategy = new FullHouse();
				break;
			case 'fourKind':
				this.strategy = new FourOfKind();
				break;
			case 'kosci':
				this.strategy = new Kosci();
				break;
			case 'chance':
				this.strategy = new Chance();
				break;
		}
	}
}

class CalculationStrategy {
	calculateScore(roll, firstRoll) {}
}

function getFrequencyArray(roll) {
	let frequencyArray = [0, 0, 0, 0, 0, 0];

	for (const item in roll) {
		frequencyArray[roll[item].side - 1] += 1;
	}

	return frequencyArray;
}

class Ones extends CalculationStrategy {
	calculateScore(roll, firstRoll) {
		let score = 0;

		for (const item in roll) {
			if (roll[item].side === 1) {
				score++;
			}
		}

		return score;
	}
}

class Twos extends CalculationStrategy {
	calculateScore(roll, firstRoll) {
		let score = 0;

		for (const item in roll) {
			if (roll[item].side === 2) {
				score += 2;
			}
		}

		return score;
	}
}

class Threes extends CalculationStrategy {
	calculateScore(roll, firstRoll) {
		let score = 0;

		for (const item in roll) {
			if (roll[item].side === 3) {
				score += 3;
			}
		}

		return score;
	}
}

class Fours extends CalculationStrategy {
	calculateScore(roll, firstRoll) {
		let score = 0;

		for (const item in roll) {
			if (roll[item].side === 4) {
				score += 4;
			}
		}

		return score;
	}
}

class Fives extends CalculationStrategy {
	calculateScore(roll, firstRoll) {
		let score = 0;

		for (const item in roll) {
			if (roll[item].side === 5) {
				score += 5;
			}
		}

		return score;
	}
}

class Sixes extends CalculationStrategy {
	calculateScore(roll, firstRoll) {
		let score = 0;

		for (const item in roll) {
			if (roll[item].side === 6) {
				score += 6;
			}
		}

		return score;
	}
}

class Pair extends CalculationStrategy {
	validateCombination(roll) {
		const frequencyArray = getFrequencyArray(roll);
		return [2, 3, 4, 5].some((val) => frequencyArray.includes(val));
	}

	calculateScore(roll, firstRoll) {
		let score = 0;

		if (this.validateCombination(roll)) {
			const frequencyArray = getFrequencyArray(roll);
			for (let i = 5; i >= 0; i--) {
				if (frequencyArray[i] >= 2) {
					score = (i + 1) * 2;
					break;
				}
			}
		}

		return firstRoll ? score * 2 : score;
	}
}

class TwoPairs extends CalculationStrategy {
	validateCombination(roll) {
		const frequencyArray = getFrequencyArray(roll);
		const pairs = [];
		let valid = false;

		for (const item in frequencyArray) {
			if (frequencyArray[item] >= 2) {
				pairs.push(frequencyArray[item]);
			}
		}

		if (pairs.length === 2 || pairs === [4] || pairs === [5]) {
			valid = true;
		}

		return valid;
	}

	calculateScore(roll, firstRoll) {
		let score = 0;
		let singlePair = false;

		if (this.validateCombination(roll)) {
			const frequencyArray = getFrequencyArray(roll);
			for (let i = 5; i >= 0; i--) {
				const item = frequencyArray[i];

				if (item === 4 || item === 5) {
					score = (i + 1) * 4;
					break;
				}

				if (singlePair && (item === 2 || item === 3)) {
					score += (i + 1) * 2;
					singlePair = false;
					break;
				}

				if (item === 2 || item === 3) {
					singlePair = true;
					score += (i + 1) * 2;
				}
			}

			if (singlePair === true) {
				score = 0;
			}
		}

		return firstRoll ? score * 2 : score;
	}
}

class SmallStraight extends CalculationStrategy {
	validateCombination(roll) {
		const frequencyArray = getFrequencyArray(roll);
		const smallStraight = [1, 1, 1, 1, 1, 0];
		let isEqual = true;

		for (let i = 0; i < frequencyArray.length; i++) {
			if (frequencyArray[i] !== smallStraight[i]) {
				isEqual = false;
			}
		}

		return isEqual;
	}

	calculateScore(roll, firstRoll) {
		let score = 0;

		if (this.validateCombination(roll)) {
			score = 15;
		}

		return firstRoll ? score * 2 : score;
	}
}

class LargeStraight extends CalculationStrategy {
	validateCombination(roll) {
		const frequencyArray = getFrequencyArray(roll);
		const largeStraight = [0, 1, 1, 1, 1, 1];
		let isEqual = true;

		for (let i = 0; i < frequencyArray.length; i++) {
			if (frequencyArray[i] !== largeStraight[i]) {
				isEqual = false;
			}
		}

		return isEqual;
	}

	calculateScore(roll, firstRoll) {
		let score = 0;

		if (this.validateCombination(roll)) {
			score = 20;
		}

		return firstRoll ? score * 2 : score;
	}
}

class ThreeOfKind extends CalculationStrategy {
	validateCombination(roll) {
		const frequencyArray = getFrequencyArray(roll);
		return [3, 4, 5].some((val) => frequencyArray.includes(val));
	}

	calculateScore(roll, firstRoll) {
		let score = 0;

		if (this.validateCombination(roll)) {
			const frequencyArray = getFrequencyArray(roll);
			for (let i = 5; i >= 0; i--) {
				if (frequencyArray[i] >= 3) {
					score = (i + 1) * 3;
					break;
				}
			}
		}

		return firstRoll ? score * 2 : score;
	}
}

class FullHouse extends CalculationStrategy {
	validateCombination(roll) {
		const frequencyArray = getFrequencyArray(roll);
		return [2, 3].every((val) => frequencyArray.includes(val));
	}

	calculateScore(roll, firstRoll) {
		let score = 0;

		if (this.validateCombination(roll)) {
			const frequencyArray = getFrequencyArray(roll);
			for (let i = 5; i >= 0; i--) {
				score += (i + 1) * frequencyArray[i];
			}
		}

		return firstRoll ? score * 2 : score;
	}
}

class FourOfKind extends CalculationStrategy {
	validateCombination(roll) {
		const frequencyArray = getFrequencyArray(roll);
		return [4, 5].some((val) => frequencyArray.includes(val));
	}

	calculateScore(roll, firstRoll) {
		let score = 0;

		if (this.validateCombination(roll)) {
			const frequencyArray = getFrequencyArray(roll);
			for (let i = 5; i >= 0; i--) {
				if (frequencyArray[i] >= 4) {
					score = (i + 1) * 4;
					score += 25; // Add bonus
					break;
				}
			}
		}

		return firstRoll ? score * 2 : score;
	}
}

class Kosci extends CalculationStrategy {
	validateCombination(roll) {
		const frequencyArray = getFrequencyArray(roll);
		return [5].some((val) => frequencyArray.includes(val));
	}

	calculateScore(roll, firstRoll) {
		let score = 0;

		if (this.validateCombination(roll)) {
			const frequencyArray = getFrequencyArray(roll);
			for (let i = 5; i >= 0; i--) {
				if (frequencyArray[i] === 5) {
					score = (i + 1) * 4;
					score += 50; // Add bonus
					break;
				}
			}
		}

		return firstRoll ? score * 2 : score;
	}
}

class Chance extends CalculationStrategy {
	calculateScore(roll, firstRoll) {
		let score = 0;

		const frequencyArray = getFrequencyArray(roll);
		for (let i = 5; i >= 0; i--) {
			score += (i + 1) * frequencyArray[i];
		}

		return firstRoll ? score * 2 : score;
	}
}

module.exports.ScoringSystem = ScoringSystem;
