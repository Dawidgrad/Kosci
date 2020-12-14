const Roll = require('../models/roll');

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
	newRoll.save();

	return newRoll;
}

async function updateRoll(roomName, playerId, toRoll) {
	const roll = await findRollByRoomName(roomName);

	let dice = updateDice(roll.dice, toRoll);
	dice = separateDice(dice);

	roll.update({ _id: roll._id }, { player: playerId, dice: dice });
	roll.save();

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

// Make sure that no die is overlapping, if they do change position
function separateDice(dice) {
	const separatedDice = dice;

	while (true) {
		let isSeparated = true;

		for (let i = 0; i < separatedDice.length; i++) {
			for (let j = i + 1; j < separatedDice.length; j++) {
				if (separatedDice[i].x >= separatedDice[j].x && separatedDice[i].x <= separatedDice[j].x + 64) {
					if (separatedDice[i].y >= separatedDice[j].y && separatedDice[i].y <= separatedDice[j].y + 64) {
						separatedDice[i].generatePosition();
						isSeparated = false;
					}
				}
			}
		}

		if (isSeparated == true) {
			break;
		}
	}

	return separatedDice;
}

class Die {
	constructor() {
		this.roll();
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
