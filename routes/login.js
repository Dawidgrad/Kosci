const express = require('express');
const bcrypt = require('bcrypt');
const userController = require('../controllers/user_controller');

const router = express.Router();

router.get('/', (req, res) => {
	if (req.session.loggedIn) {
		res.redirect('/home');
	} else {
		res.render('login');
	}
});

// Authenticate user
router.post('/', async (req, res) => {
	const user = await userController.findUserByEmail(req.body.email);
	if (user === undefined) {
		res.status(400).send('Cannot find user');
	}

	try {
		if (await bcrypt.compare(req.body.password, user.password)) {
			req.session.loggedIn = true;
			req.session.email = req.body.email;
			res.redirect('/home');
		} else {
			const data = { error: 'Incorrect user credentials!' };
			res.render('login', data);
			// res.redirect('/login');
		}
	} catch {
		res.status(500).send();
	}
});

module.exports = router;
