const Scoreboard = require('../models/scoreboard');

async function findScoreboard(playerName, roomName) {
	const scoreboard = await Scoreboard.findOne({ playerName: playerName, roomName: roomName }).exec();
	return scoreboard;
}

async function updateScoreboard(playerName, roomName, scores) {
	const scoreboard = await findScoreboard(playerName, roomName);

	scoreboard.update({ _id: scoreboard._id }, { scores: scores });
	scoreboard.save((error) => {
		if (error) {
			console.log('Could not update scoreboard!');
		}
	});

	return scoreboard;
}

async function createScoreboard(playerName, roomName) {
	const data = {
		playerName: playerName,
		roomName: roomName,
	};

	const newScoreboard = new Scoreboard(data);
	await newScoreboard.save((error) => {
		if (error) {
			console.log('Could not create the scoreboard');
		}
	});
}

module.exports.findScoreboard = findScoreboard;
module.exports.updateScoreboard = updateScoreboard;
module.exports.createScoreboard = createScoreboard;
