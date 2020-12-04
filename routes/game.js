const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	if (req.session.loggedIn) {
		res.render('game');
		const io = res.app.get('io');

		// Socket.io
		io.on('connection', (socket) => {
			// Socket handles
		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
