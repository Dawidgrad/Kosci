const express = require('express');
const roomController = require('../controllers/room_controller');

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
			socket.on('create room', async (roomSize) => {
				const name = await roomController.createRoom(roomSize);
				socket.join(name);
				socket.emit('room created', name);
			});

			socket.on('join room', (name) => {
				socket.join(name);
				console.log(socket.rooms);
			});

			socket.on('start game', async () => {
				const roomSet = socket.rooms;
				const roomName = [...roomSet][roomSet.size - 1];
				await roomController.updateRoomProgress(roomName, true);
				io.in(roomName).emit('game started');
			});
		});

		listenersSetUp = true;
	}
}

module.exports = router;
