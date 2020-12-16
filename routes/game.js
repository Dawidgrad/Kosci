const express = require('express');
const roomController = require('../controllers/room_controller');
const rollController = require('../controllers/roll_controller');
const scoreboardController = require('../controllers/scoreboard_controller');

const router = express.Router();

let listenersSetUp = false;

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
				console.log(socket.rooms);
			});

			socket.on('start game', async () => {
				const roomSet = socket.rooms;
				const roomName = [...roomSet][roomSet.size - 1];
				await roomController.updateRoomProgress(roomName, true);

				// Create scoreboards
				const room = await roomController.findRoomByName(roomName);

				scoreboards = [];
				for (let i = 0; i < room.participants.length; i++) {
					const newScoreboard = await scoreboardController.createScoreboard(
						room.participants[i].nickname,
						roomName
					);
					scoreboards.push(newScoreboard);
				}
				io.in(roomName).emit('update scoreboards', scoreboards);

				// Generate first roll
				const roll = await rollController.createRoll(roomName, socket.id);
				io.in(roomName).emit('next roll', roll);
			});

			socket.on('roll dice', async (data) => {
				const roomSet = socket.rooms;
				const roomName = [...roomSet][roomSet.size - 1];
				const roll = await rollController.updateRoll(roomName, socket.id, data.toRoll);
				io.in(roomName).emit('next roll', roll);
			});

			socket.on('submit roll', () => {
				// Update scoreboard in the database

				socket.emit('update scoreboards', scoreboards);
			});
		});

		listenersSetUp = true;
	}
}

module.exports = router;
