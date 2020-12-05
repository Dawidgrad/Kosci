const express = require('express');

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
			socket.on('join server', (username) => {
				console.log(`${username} joined the server`);
			});
		});
		listenersSetUp = true;
	}
}

module.exports = router;
