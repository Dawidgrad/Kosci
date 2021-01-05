const intersect = require('@turf/intersect').default;
const helpers = require('@turf/helpers');
const Die = require('./die.js').Die;

const IMAGE_SIZE = 64;

class RollingSystem {
	// Create completely new roll
	newRoll() {
		let dice = [];
		for (let i = 0; i < 5; i++) {
			dice.push(new Die());
		}
		dice = this.separateDice(dice);

		return dice;
	}

	// Reroll some of the dice
	reroll(dice, diceToRoll) {
		if (diceToRoll) {
			for (let i = 0; i < diceToRoll.length; i++) {
				dice[diceToRoll[i]] = new Die();
			}

			dice = this.separateSelectedDice(dice, diceToRoll);
		}

		return dice;
	}

	// Ensure that the dice are not overlapping
	separateDice(dice) {
		while (true) {
			let areSeparated = true;

			// Compare each die against other dice
			for (let i = 0; i < dice.length; i++) {
				for (let j = i + 1; j < dice.length; j++) {
					const intersection = this.checkIntersection(dice[i], dice[j]);

					// If dice intersect, generate new position
					if (intersection !== null) {
						areSeparated = false;
						dice[i] = new Die(dice[i].side);
					}
				}
			}

			// Break if none of the dice are overlapping
			if (areSeparated == true) {
				break;
			}
		}

		return dice;
	}

	// Ensure that dice to roll are not overlapping
	separateSelectedDice(dice, diceToRoll) {
		while (true) {
			let areSeparated = true;

			for (let i = 0; i < diceToRoll.length; i++) {
				for (let j = 0; j < dice.length; j++) {
					if (dice[diceToRoll[i]] === dice[j]) {
						continue;
					}

					const intersection = this.checkIntersection(dice[diceToRoll[i]], dice[j]);

					// If dice intersect, generate new position
					if (intersection !== null) {
						areSeparated = false;
						dice[diceToRoll[i]] = new Die(dice[i].side);
					}
				}
			}

			// Break if none of the dice are overlapping
			if (areSeparated == true) {
				break;
			}
		}

		return dice;
	}

	// Checks if two dice are intersecting with eachother
	checkIntersection(dieA, dieB) {
		const diePolygonA = helpers.polygon([
			[
				[dieA.x, dieA.y],
				[dieA.x, dieA.y + IMAGE_SIZE],
				[dieA.x + IMAGE_SIZE, dieA.y + IMAGE_SIZE],
				[dieA.x + IMAGE_SIZE, dieA.y],
				[dieA.x, dieA.y],
			],
		]);

		const diePolygonB = helpers.polygon([
			[
				[dieB.x, dieB.y],
				[dieB.x, dieB.y + IMAGE_SIZE],
				[dieB.x + IMAGE_SIZE, dieB.y + IMAGE_SIZE],
				[dieB.x + IMAGE_SIZE, dieB.y],
				[dieB.x, dieB.y],
			],
		]);

		const intersection = intersect(diePolygonA, diePolygonB);
		return intersection;
	}
}

module.exports.RollingSystem = RollingSystem;
