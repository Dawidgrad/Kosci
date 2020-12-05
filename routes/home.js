const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	if (req.session.loggedIn) {
		res.render('home');
		const io = res.app.get('io');

		io.on('connection', (socket) => {
			socket.on('join server', (username) => {
				console.log(`${username} joined the server`);
			});
		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
