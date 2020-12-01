const express = require('express');
const bcrypt = require('bcrypt');
const userController = require('../controllers/user_controller');

const router = express.Router();

router.get('/', (req, res) => {
	if (req.session.loggedIn) {
		res.redirect('/home');
	} else {
		res.render('register');
	}
});

// Create user
router.post('/', async (req, res) => {
	try {
		data = {};
		if (
			(await userController.findUserByEmail(req.body.email)) ||
			(await userController.findUserByNickname(req.body.nickname))
		) {
			data = { error: 'User already exists!' };
		} else {
			const salt = await bcrypt.genSalt();
			const hashedPassword = await bcrypt.hash(req.body.password, salt);
			const { nickname, email } = req.body;
			await userController.addUser({ nickname, password: hashedPassword, email });

			data = { message: 'User successfully added!' };
		}
		res.render('register', data);
	} catch {
		res.status(500).send();
	}
});

module.exports = router;
