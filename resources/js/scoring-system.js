class ScoringSystem {}

class CalculationStrategy {
	validateCombination(roll) {}
	calculateScore(roll, firstRoll) {}
}

class Ones extends CalculationStrategy {
	validateCombination(roll) {
		let onesCount = 0;

		for (const item in roll) {
			if (roll[item].side === 1) {
				onesCount++;
			}
		}

		return onesCount > 0;
	}

	calculateScore(roll, firstRoll) {
		let score = 0;

		if (this.validateCombination(roll)) {
			for (const item in roll) {
				if (roll[item].side === 1) {
					score++;
				}
			}
		}

		return score;
	}
}

class Twos extends CalculationStrategy {
	validateCombination(roll) {
		let twosCount = 0;

		for (const item in roll) {
			if (roll[item].side === 2) {
				twosCount++;
			}
		}

		return twosCount > 0;
	}

	calculateScore(roll, firstRoll) {
		let score = 0;

		if (this.validateCombination(roll)) {
			for (const item in roll) {
				if (roll[item].side === 2) {
					score += 2;
				}
			}
		}

		return score;
	}
}

class Threes extends CalculationStrategy {
	validateCombination(roll) {
		let threesCount = 0;

		for (const item in roll) {
			if (roll[item].side === 3) {
				threesCount++;
			}
		}

		return threesCount > 0;
	}

	calculateScore(roll, firstRoll) {
		let score = 0;

		if (this.validateCombination(roll)) {
			for (const item in roll) {
				if (roll[item].side === 3) {
					score += 3;
				}
			}
		}

		return score;
	}
}

class Fours extends CalculationStrategy {
	validateCombination(roll) {
		let foursCount = 0;

		for (const item in roll) {
			if (roll[item].side === 4) {
				foursCount++;
			}
		}

		return foursCount > 0;
	}

	calculateScore(roll, firstRoll) {
		let score = 0;

		if (this.validateCombination(roll)) {
			for (const item in roll) {
				if (roll[item].side === 4) {
					score += 4;
				}
			}
		}

		return score;
	}
}

class Fives extends CalculationStrategy {
	validateCombination(roll) {
		let fivesCount = 0;

		for (const item in roll) {
			if (roll[item].side === 5) {
				fivesCount++;
			}
		}

		return fivesCount > 0;
	}

	calculateScore(roll, firstRoll) {
		let score = 0;

		if (this.validateCombination(roll)) {
			for (const item in roll) {
				if (roll[item].side === 5) {
					score += 5;
				}
			}
		}

		return score;
	}
}

class Sixes extends CalculationStrategy {
	validateCombination(roll) {
		let sixesCount = 0;

		for (const item in roll) {
			if (roll[item].side === 6) {
				sixesCount++;
			}
		}

		return sixesCount > 0;
	}

	calculateScore(roll, firstRoll) {
		let score = 0;

		if (this.validateCombination(roll)) {
			for (const item in roll) {
				if (roll[item].side === 6) {
					score += 6;
				}
			}
		}

		return score;
	}
}

class Pair extends CalculationStrategy {
	validateCombination(roll) {
		const frequencyArray = getFrequencyArray(roll);
		return [2, 3, 4, 5, 6].some((val) => frequencyArray.includes(val));
	}

	calculateScore(roll, firstRoll) {
		let score = 0;

		if (this.validateCombination(roll)) {
			const frequencyArray = getFrequencyArray();
			for (let i = 5; i >= 0; i--) {
				if (frequencyArray[i] >= 2) {
					score = (i + 1) * 2;
				}
			}
		}

		return firstRoll ? score * 2 : score;
	}

	getFrequencyArray(roll) {
		let frequencyArray = [0, 0, 0, 0, 0, 0];

		for (const item in roll) {
			frequencyArray[roll[item].side - 1] += 1;
		}

		return frequencyArray;
	}
}
