class GameSystem {
	constructor(name, players, scoreboards) {
		this.name = name;
		this.players = players;
		this.scoreboards = scoreboards;
		this.currentPlayer = players[0];
		this.numberOfRolls = 0;
		this.currentRoll = new RollingSystem();
		this.roundCount = 1;
	}

	roll() {
		this.numberOfRolls += 1;
		return this.currentRoll.newRoll().dice;
	}

	scoreSubmission() {}

	nextPlayer() {
		this.numberOfRolls = 0;

		// Get the next player
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].nickname === this.currentPlayer.nickname) {
				if (i + 1 === this.players.length) {
					this.currentPlayer = this.players[0];
					this.nextRound();
				} else {
					this.currentPlayer = this.players[i + 1];
				}
			}
		}

		// Get new roll
		return this.roll();
	}

	nextRound() {
		this.roundCount += 1;

		// Check if the round was the last one
		if (this.roundCount > 15) {
			this.finishGame();
		}
	}

	finishGame() {}
}
