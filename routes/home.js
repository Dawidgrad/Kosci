const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	if (req.session.loggedIn) {
		res.render('home');
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
