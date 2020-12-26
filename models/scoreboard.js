const mongoose = require('mongoose');

const scoreboardSchema = new mongoose.Schema(
	{
		player: String,
		score: Number,
		participants: [String],
		winner: Boolean,
	},
	{ collection: 'scoreboard' }
);
const Scoreboard = mongoose.model('scoreboard', scoreboardSchema);

module.exports = Scoreboard;
