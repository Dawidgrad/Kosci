const express = require('express');
const roomController = require('../controllers/room_controller');

const router = express.Router();

router.get('/', (req, res) => {
	if (req.session.loggedIn) {
		res.render('game');
		const io = res.app.get('io');

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

			socket.on('start game', () => {
				const roomSet = socket.rooms;
				const roomName = [...roomSet][roomSet.size - 1];
				io.in(roomName).emit('game started');
			});
		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
