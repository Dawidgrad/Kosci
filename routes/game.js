const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	if (req.session.loggedIn) {
		res.render('game');
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
