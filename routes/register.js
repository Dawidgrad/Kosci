const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	if (req.session.loggedIn) {
		res.redirect('/home');
	} else {
		res.render('register');
	}
});

module.exports = router;
