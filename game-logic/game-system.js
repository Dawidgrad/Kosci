const RollingSystem = require('./rolling-system').RollingSystem;
const ScoringSystem = require('./scoring-system').ScoringSystem;
const Scoreboard = require('./scoreboard').Scoreboard;
const Player = require('./player').Player;
const MAX_ROUND = 15;

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
		this.scoringSystem = new ScoringSystem();
		this.gameEnded = false;
		this.winner = '';
	}

	// Initialise the state of the game
	start() {
		this.currentRoll = this.rollSystem.newRoll();
		this.currentPlayer = this.players[0];
		this.roundCount = 1;
		this.rollsLeft = 2;
	}

	// Reroll all or part of the current dice roll
	reroll(diceToRoll) {
		if (this.rollsLeft > 0) {
			this.rollsLeft -= 1;
			this.currentRoll = this.rollSystem.reroll(this.currentRoll, diceToRoll);
		}
	}

	// Submit a score selected by the user with a current roll and switch to the next player
	submitRoll(rowToUpdate) {
		for (const item in this.scoreboards) {
			if (this.scoreboards[item].player === this.currentPlayer.nickname) {
				const isFirstRoll = this.rollsLeft === 2 ? true : false;
				this.scoreboards[item].scores[rowToUpdate] = this.scoringSystem.calculateScore(
					rowToUpdate,
					this.currentRoll,
					isFirstRoll
				);
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
			gameEnded: this.gameEnded,
			winner: this.winner,
		};
		return gameState;
	}

	nextPlayer() {
		this.rollsLeft = 2;

		// Get the next player
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].nickname === this.currentPlayer.nickname) {
				const nextIndex = i + 1;
				if (nextIndex === this.players.length) {
					this.currentPlayer = this.players[0];
					this.nextRound();
				} else {
					this.currentPlayer = this.players[i + 1];
				}
				break;
			}
		}

		// Get new roll
		this.currentRoll = this.rollSystem.newRoll();
	}

	nextRound() {
		this.roundCount += 1;

		// Check if the round was the last one
		if (this.roundCount > MAX_ROUND) {
			this.finishGame();
		}
	}

	finishGame() {
		this.gameEnded = true;
		let highestScore = 0;
		let winner = '';

		for (const item in this.scoreboards) {
			const score = this.scoringSystem.getFinalScore(this.scoreboards[item].scores);
			this.scoreboards[item].finalScore = score;

			if (score > highestScore) {
				highestScore = score;
				winner = this.scoreboards[item].player;
			}
		}

		this.winner = winner;
	}
}

module.exports.GameSystem = GameSystem;
