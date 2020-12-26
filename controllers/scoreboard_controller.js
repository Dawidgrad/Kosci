const Scoreboard = require('../models/scoreboard');

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
	await newScoreboard.save((error) => {
		if (error) {
			console.log('Could not create the scoreboard');
		}
	});
	return newScoreboard;
}

module.exports.submitScoreboards = submitScoreboards;
