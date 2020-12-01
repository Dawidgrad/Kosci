const express = require('express');

const router = express.Router();

// Log out the user
router.get('/', async (req, res) => {
	if (req.session.loggedIn) {
		req.session.loggedIn = false;
		res.redirect('/login');
	}
	res.end();
});

module.exports = router;
