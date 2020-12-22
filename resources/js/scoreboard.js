class Scoreboard {
	constructor(player) {
		this.player = player;
		this.scores = {
			ones: null,
			twos: null,
			threes: null,
			fours: null,
			fives: null,
			sixes: null,
			pair: null,
			twoPairs: null,
			smallStraight: null,
			largeStraight: null,
			threeKind: null,
			fullHouse: null,
			fourKind: null,
			kosci: null,
			chance: null,
		};
	}

	updateScoreboard(scores) {
		this.scores = scores;
	}
}

module.exports.Scoreboard = Scoreboard;
