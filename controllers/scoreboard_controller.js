const Scoreboard = require('../models/scoreboard');
const { options } = require('../routes/game');

async function findScoreboard(nickname, roomName) {
	const scoreboard = await Scoreboard.findOne({ player: nickname, roomName: roomName }).exec();
	return scoreboard;
}

async function findRoomScoreboards(roomName) {
	const scoreboards = await Scoreboard.find({ roomName: roomName }).exec();
	return scoreboards;
}

async function updateScoreboard(nickname, roomName, scores) {
	const scoreboard = await findScoreboard(nickname, roomName);
	scoreboard.scores = scores;

	await scoreboard.save((error) => {
		if (error) {
			console.log('Could not update scoreboard!');
		}
	});
}

async function createScoreboard(nickname, roomName) {
	const data = {
		player: nickname,
		roomName: roomName,
	};

	const newScoreboard = new Scoreboard(data);
	await newScoreboard.save((error) => {
		if (error) {
			console.log('Could not create the scoreboard');
		}
	});
	return newScoreboard;
}

module.exports.findScoreboard = findScoreboard;
module.exports.findRoomScoreboards = findRoomScoreboards;
module.exports.updateScoreboard = updateScoreboard;
module.exports.createScoreboard = createScoreboard;
