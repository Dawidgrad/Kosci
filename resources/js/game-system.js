const RollingSystem = require('./rolling-system').RollingSystem;
const Scoreboard = require('./scoreboard').Scoreboard;
const Player = require('./player').Player;

class GameSystem {
	constructor(name, players) {
		this.name = name;
		this.players = [];

		// Create an array of players
		for (let i = 0; i < players.length; i++) {
			const player = new Player(players[i].nickname, players[i]._id);
			this.players.push(player);
		}

		console.log(this.players);

		// Create a scoreboard for each player
		this.scoreboards = [];

		for (let i = 0; i < this.players.length; i++) {
			this.scoreboards.push(new Scoreboard(this.players[i].nickname));
		}
	}

	// Initialise the state of the game
	start() {
		this.currentRoll = new RollingSystem().newRoll();
		this.currentPlayer = this.players[0];
		this.roundCount = 1;
		this.rollsLeft = 3;
	}

	// Reroll all or part of the current dice roll
	reroll(diceToRoll) {
		if (this.rollsLeft > 0) {
			this.rollsLeft -= 1;
			this.currentRoll.reroll(diceToRoll);
		}
	}

	// Submit a selected score with a current roll
	submitRoll() {}

	// Returns current game state
	getGameState() {
		const gameState = {
			currentRoll: this.currentRoll,
			currentPlayer: this.currentPlayer,
			scoreboards: this.scoreboards,
			rollsLeft: this.rollsLeft,
		};
		return gameState;
	}

	nextPlayer() {
		this.rollsLeft = 0;

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
		this.reroll();
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

module.exports.GameSystem = GameSystem;
