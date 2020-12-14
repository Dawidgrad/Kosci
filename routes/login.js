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
	if (user === null) {
		const data = { error: 'Incorrect user credentials!' };
		res.render('login', data);
	}

	try {
		if (await bcrypt.compare(req.body.password, user.password)) {
			req.session.loggedIn = true;
			req.session.email = req.body.email;
			req.session.nickname = user.nickname;
			res.redirect('/home');
		} else {
			const data = { error: 'Incorrect user credentials!' };
			res.render('login', data);
		}
	} catch {
		res.status(500).send();
	}
});

module.exports = router;
