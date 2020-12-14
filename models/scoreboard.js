const mongoose = require('mongoose');

const scoreboardSchema = new mongoose.Schema(
	{
		roomName: String,
		player: String,
		scores: {
			ones: { type: Number, default: null },
			twos: { type: Number, default: null },
			threes: { type: Number, default: null },
			fours: { type: Number, default: null },
			fives: { type: Number, default: null },
			sixes: { type: Number, default: null },
			pair: { type: Number, default: null },
			twoPairs: { type: Number, default: null },
			smallStraight: { type: Number, default: null },
			largeStraight: { type: Number, default: null },
			threeKind: { type: Number, default: null },
			fullHouse: { type: Number, default: null },
			fourKind: { type: Number, default: null },
			kosci: { type: Number, default: null },
			chance: { type: Number, default: null },
		},
	},
	{ collection: 'scoreboard' }
);
const Scoreboard = mongoose.model('scoreboard', scoreboardSchema);

module.exports = Scoreboard;
