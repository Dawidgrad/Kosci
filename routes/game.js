const express = require('express');
const roomController = require('../controllers/room_controller');
const scoreboardController = require('../controllers/scoreboard_controller');
const GameSystem = require('../resources/js/game-system').GameSystem;

const router = express.Router();

let listenersSetUp = false;
const games = [];

router.get('/', (req, res) => {
	if (req.session.loggedIn) {
		res.render('game');
		const io = res.app.get('io');
		setUpSocketListeners(io);
	} else {
		res.redirect('/login');
	}
});

function setUpSocketListeners(io) {
	if (listenersSetUp == false) {
		io.on('connection', (socket) => {
			socket.on('create room', async (nickname) => {
				const name = await roomController.createRoom(nickname);
				socket.join(name);
				socket.emit('room created', name);
			});

			socket.on('join room', (name, nickname) => {
				socket.join(name);
				roomController.registerUser(name, nickname);
			});

			socket.on('start game', async () => {
				// Change state of the room on the database
				const roomSet = socket.rooms;
				const roomName = [...roomSet][roomSet.size - 1];
				await roomController.updateRoomProgress(roomName, true);
				const room = await roomController.findRoomByName(roomName);

				// Create game
				const game = new GameSystem(roomName, room.participants);
				games.push(game);
				game.start();
				const gameState = game.getGameState();
				io.in(roomName).emit('game state update', gameState);
			});

			socket.on('roll dice', async (data) => {
				// Find the game that this socket participates in
				const roomSet = socket.rooms;
				const roomName = [...roomSet][roomSet.size - 1];
				let game;

				for (const item in games) {
					if (games[item].name === roomName) {
						game = games[item];
					}
				}

				if (game) {
					game.reroll(data.diceToRoll);
					const gameState = game.getGameState();
					io.in(roomName).emit('game state update', gameState);
				} else {
					console.log('Could not find the game!');
				}
			});

			socket.on('submit roll', async (data) => {
				// Find the game that this socket participates in
				const roomSet = socket.rooms;
				const roomName = [...roomSet][roomSet.size - 1];
				let game;

				for (const item in games) {
					if (games[item].name === roomName) {
						game = games[item];
					}
				}

				if (game) {
					game.submitRoll(data.rowToSubmit);
					let gameState = game.getGameState();
					if (gameState.gameEnded) {
						scoreboardController.submitScoreboards(gameState.scoreboards, gameState.winner);
						io.in(roomName).emit('game ended', gameState);
					} else {
						io.in(roomName).emit('game state update', gameState);
					}
				} else {
					console.log('Could not find the game!');
				}
			});
		});

		listenersSetUp = true;
	}
}

module.exports = router;
