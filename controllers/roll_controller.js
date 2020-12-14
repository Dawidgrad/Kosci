const Roll = require('../models/roll');
const intersect = require('@turf/intersect').default;
const helpers = require('@turf/helpers');

const IMAGE_SIZE = 64;

async function findRollByRoomName(roomName) {
	const roll = await Roll.findOne({ roomName: roomName }).exec();
	return roll;
}

async function createRoll(roomName, playerId) {
	let dice = createDice();
	dice = separateDice(dice);

	const roll = {
		roomName: roomName,
		player: playerId,
		dice: dice,
	};

	const newRoll = new Roll(roll);
	newRoll.save((error) => {
		if (error) {
			console.log('Could not create roll!');
		}
	});

	return newRoll;
}

async function updateRoll(roomName, playerId, toRoll) {
	const roll = await findRollByRoomName(roomName);

	let dice = updateDice(roll.dice, toRoll);
	dice = separateSelectedDice(dice, toRoll);

	roll.update({ _id: roll._id }, { player: playerId, dice: dice });
	roll.save((error) => {
		if (error) {
			console.log('Could not update roll!');
		}
	});

	return roll;
}

function createDice() {
	const dice = [];

	for (let i = 0; i < 5; i++) {
		dice.push(new Die());
	}

	return dice;
}

function updateDice(dice, toRoll) {
	const newDice = dice;

	for (let i = 0; i < toRoll.length; i++) {
		newDice[toRoll[i]] = new Die();
	}

	return newDice;
}

// Ensure that the dice are not overlapping
function separateDice(dice) {
	const separatedDice = dice;

	while (true) {
		let areSeparated = true;

		// Compare each die against other dice
		for (let i = 0; i < separatedDice.length; i++) {
			for (let j = i + 1; j < separatedDice.length; j++) {
				// Check if dice intersect
				const intersection = checkIntersection(separatedDice[i], separatedDice[j]);

				// If they intersect, generate new position
				if (intersection !== null) {
					areSeparated = false;
					separatedDice[i] = new Die(separatedDice[i].side);
				}
			}
		}

		// Break if none of the dice are overlapping
		if (areSeparated == true) {
			break;
		}
	}

	return separatedDice;
}

// Ensure that selected dice are not overlapping
function separateSelectedDice(dice, toRoll) {
	const separatedDice = dice;

	while (true) {
		let areSeparated = true;

		for (let i = 0; i < toRoll.length; i++) {
			for (let j = 0; j < dice.length; j++) {
				if (dice[toRoll[i]] === dice[j]) {
					continue;
				}

				// Check if dice intersect
				const intersection = checkIntersection(dice[toRoll[i]], dice[j]);

				// If they intersect, generate new position
				if (intersection !== null) {
					areSeparated = false;
					dice[toRoll[i]] = new Die(separatedDice[i].side);
				}
			}
		}

		// Break if none of the dice are overlapping
		if (areSeparated == true) {
			break;
		}
	}

	return separatedDice;
}

// Check if dies intersect using turf library
function checkIntersection(dieA, dieB) {
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

	// Check if the coordinates intersect
	const intersection = intersect(diePolygonA, diePolygonB);
	return intersection;
}

class Die {
	constructor(side) {
		if (side) {
			this.side = side;
		} else {
			this.roll();
		}
		this.generatePosition();
	}

	roll() {
		this.side = Math.ceil(Math.random() * 6);
	}

	generatePosition() {
		this.x = Math.ceil(Math.random() * 500);
		this.y = Math.ceil(Math.random() * 500);
	}
}

module.exports.findRollByRoomName = findRollByRoomName;
module.exports.createRoll = createRoll;
module.exports.updateRoll = updateRoll;
