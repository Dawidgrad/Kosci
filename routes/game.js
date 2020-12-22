const express = require('express');
const roomController = require('../controllers/room_controller');
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

				// Create scoreboards

				// scoreboards = [];
				// for (let i = 0; i < room.participants.length; i++) {
				// 	const newScoreboard = await scoreboardController.createScoreboard(
				// 		room.participants[i].nickname,
				// 		roomName
				// 	);
				// 	scoreboards.push(newScoreboard);
				// }
				// io.in(roomName).emit('update scoreboards', scoreboards);

				// Generate first roll
				// const roll = await rollController.createRoll(roomName, socket.id);
				// io.in(roomName).emit('next roll', roll);
			});

			socket.on('roll dice', async (data) => {
				const roomSet = socket.rooms;
				const roomName = [...roomSet][roomSet.size - 1];
				let game;

				for (const item in games) {
					if (games[item].name === roomName) {
						game = games[item];
					}
				}

				if (game) {
					game.reroll();
					const gameState = game.getGameState();
					io.in(roomName).emit('game state update', gameState);
				} else {
					console.log('Could not find the game!');
				}

				// const roll = await rollController.updateRoll(roomName, socket.id, data.toRoll);
				// io.in(roomName).emit('next roll', roll);
			});

			socket.on('submit roll', async (data) => {
				const roomSet = socket.rooms;
				const roomName = [...roomSet][roomSet.size - 1];
				let game;

				for (const item in games) {
					if (games[item].name === roomName) {
						game = games[item];
					}
				}

				if (game) {
					game.submitRoll();
					const gameState = game.getGameState();
					io.in(roomName).emit('game state update', gameState);
				} else {
					console.log('Could not find the game!');
				}

				// // Update scoreboard
				// const scoreboard = await scoreboardController.findScoreboard(data.nickname, roomName);
				// scoreboard.scores[data.row] = 1; // Calculate score based on roll and row selected
				// await scoreboardController.updateScoreboard(data.nickname, roomName, scoreboard.scores);
				// // Get all scoreboards in the room
				// const roomScoreboards = await scoreboardController.findRoomScoreboards(roomName);
				// socket.emit('update scoreboards', roomScoreboards);
			});
		});

		listenersSetUp = true;
	}
}

module.exports = router;
