const express = require('express');
const roomController = require('../controllers/room_controller');
const rollController = require('../controllers/roll_controller');

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
				const roll = await rollController.createRoll(roomName, socket.id);
				io.in(roomName).emit('next roll', roll);
			});

			// data: roll = [1, 2, 5]
			socket.on('roll dice', async (data) => {
				const roomSet = socket.rooms;
				const roomName = [...roomSet][roomSet.size - 1];
				const roll = await rollController.updateRoll(roomName, socket.id, data.toRoll);
				io.in(roomName).emit('next roll', roll);
			});

			socket.on('select score', () => {});
		});

		listenersSetUp = true;
	}
}

module.exports = router;
