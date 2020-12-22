const intersect = require('@turf/intersect').default;
const helpers = require('@turf/helpers');
const Die = require('./die.js').Die;

const IMAGE_SIZE = 64;

class RollingSystem {
	constructor() {
		this.dice = [];
	}

	// Create completely new roll
	newRoll() {
		if (this.dice.length === 0) {
			for (let i = 0; i < 5; i++) {
				this.dice.push(new Die());
			}
		}

		this.separateDice();
	}

	// Reroll some of the dice
	reroll(diceToRoll) {
		for (let i = 0; i < diceToRoll.length; i++) {
			this.dice[diceToRoll[i]] = new Die();
		}

		this.separateSelectedDice(diceToRoll);
	}

	// Ensure that the dice are not overlapping
	separateDice() {
		while (true) {
			let areSeparated = true;

			// Compare each die against other dice
			for (let i = 0; i < this.dice.length; i++) {
				for (let j = i + 1; j < this.dice.length; j++) {
					const intersection = this.checkIntersection(this.dice[i], this.dice[j]);

					// If dice intersect, generate new position
					if (intersection !== null) {
						areSeparated = false;
						this.dice[i] = new Die(this.dice[i].side);
					}
				}
			}

			// Break if none of the dice are overlapping
			if (areSeparated == true) {
				break;
			}
		}
	}

	// Ensure that dice to roll are not overlapping
	separateSelectedDice(toRoll) {
		while (true) {
			let areSeparated = true;

			for (let i = 0; i < toRoll.length; i++) {
				for (let j = 0; j < this.dice.length; j++) {
					if (this.dice[toRoll[i]] === this.dice[j]) {
						continue;
					}

					const intersection = this.checkIntersection(this.dice[toRoll[i]], this.dice[j]);

					// If dice intersect, generate new position
					if (intersection !== null) {
						areSeparated = false;
						this.dice[toRoll[i]] = new Die(this.dice[i].side);
					}
				}
			}

			// Break if none of the dice are overlapping
			if (areSeparated == true) {
				break;
			}
		}
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
