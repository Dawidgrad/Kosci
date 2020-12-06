const express = require('express');
const roomController = require('../controllers/room_controller');

const router = express.Router();

let listenersSetUp = false;

router.get('/', (req, res) => {
	if (req.session.loggedIn) {
		res.render('home');
		io = res.app.get('io');
		setUpSocketListeners(io);
	} else {
		res.redirect('/login');
	}
});

function setUpSocketListeners(io) {
	if (listenersSetUp == false) {
		io.on('connection', (socket) => {
			socket.on('get room list', async () => {
				const rooms = await roomController.findAllRooms();
				socket.emit('update room list', rooms);
			});
		});

		listenersSetUp = true;
	}
}

module.exports = router;
