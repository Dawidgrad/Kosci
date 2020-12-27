const express = require('express');
const roomController = require('../controllers/room_controller');

const router = express.Router();

let listenersSetUp = false;

router.get('/', (req, res) => {
	if (req.session.loggedIn) {
		const data = { nickname: req.session.nickname };
		res.render('home', data);
		io = res.app.get('io');
		setUpSocketListeners(io);
	} else {
		res.redirect('/login');
	}
});

function setUpSocketListeners(io) {
	if (listenersSetUp == false) {
		io.on('connection', (socket) => {
			socket.on('get list', async () => {
				const rooms = await roomController.findAllRooms();
				socket.emit('update list', rooms);
			});

			socket.on('list change', async () => {
				setTimeout(async () => {
					const rooms = await roomController.findAllRooms();
					io.emit('update list', rooms);
				}, 1000);
			});
		});

		listenersSetUp = true;
	}
}

module.exports = router;
