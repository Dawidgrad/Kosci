const { create } = require('../models/scoreboard');
const Scoreboard = require('../models/scoreboard');

async function findUserScoreboards(nickname) {
	const scoreboards = await Scoreboard.find({ player: nickname }).exec();
	return scoreboards;
}

async function submitScoreboards(scoreboards, winner) {
	const participants = [];

	for (const item in scoreboards) {
		participants.push(scoreboards[item].player);
	}

	for (const item in scoreboards) {
		const nickname = scoreboards[item].player;
		const score = scoreboards[item].finalScore;
		const hasWon = scoreboards[item].player === winner;

		await createScoreboard(nickname, participants, score, hasWon);
	}
}

async function createScoreboard(nickname, participants, score, hasWon) {
	const data = {
		player: nickname,
		participants: participants,
		score: score,
		winner: hasWon,
	};

	const newScoreboard = new Scoreboard(data);
	return newScoreboard.save();
}

async function updateScoreboardsPlayerName(nickname, newNickname) {
	const scoreboards = await findUserScoreboards(nickname);

	for (const item in scoreboards) {
		scoreboards[item].player = newNickname;
		await scoreboards[item].save();
	}
}

module.exports.findUserScoreboards = findUserScoreboards;
module.exports.submitScoreboards = submitScoreboards;
module.exports.createScoreboard = createScoreboard;
module.exports.updateScoreboardsPlayerName = updateScoreboardsPlayerName;
