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

		// Create a scoreboard for each player
		this.scoreboards = [];

		for (let i = 0; i < this.players.length; i++) {
			this.scoreboards.push(new Scoreboard(this.players[i].nickname));
		}

		this.rollSystem = new RollingSystem();
	}

	// Initialise the state of the game
	start() {
		this.currentRoll = this.rollSystem.newRoll();
		this.currentPlayer = this.players[0];
		this.roundCount = 1;
		this.rollsLeft = 3;
	}

	// Reroll all or part of the current dice roll
	reroll(diceToRoll) {
		if (this.rollsLeft > 0) {
			this.rollsLeft -= 1;
			this.currentRoll = this.rollSystem.reroll(this.currentRoll, diceToRoll);
		}
	}

	// Submit a score selected by the user with a current roll and switch to next player
	submitRoll(rowToUpdate) {
		// Find the scoreboard and update it
		for (const item in this.scoreboards) {
			console.log(this.scoreboards[item].player);
			console.log(this.currentPlayer.nickname);
			if (this.scoreboards[item].player === this.currentPlayer.nickname) {
				this.scoreboards[item].scores[rowToUpdate] = 1;
			}
		}

		this.nextPlayer();
	}

	// Returns current game state
	getGameState() {
		const gameState = {
			currentRoll: this.currentRoll,
			currentPlayer: this.currentPlayer,
			scoreboards: this.scoreboards,
			rollsLeft: this.rollsLeft,
			roundCount: this.roundCount,
		};
		return gameState;
	}

	nextPlayer() {
		this.rollsLeft = 3;

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
		this.currentRoll = this.rollSystem.newRoll();
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
