const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	if (req.session.loggedIn) {
		res.render('home');

		const io = res.app.get('io');

		// Socket.io
		io.on('connection', (socket) => {
			socket.on('join server', (username) => {
				console.log(':)');
				socket.emit('room update', rooms);
			});

			socket.on('room update', (roomName, roomSize, busySlots) => {
				io.emit('room update', rooms);
			});
		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
