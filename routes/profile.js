const express = require('express');
const bcrypt = require('bcrypt');
const userController = require('../controllers/user_controller');

const router = express.Router();

router.get('/', (req, res) => {
	if (req.session.loggedIn) {
		res.render('profile');
	} else {
		res.redirect('/login');
	}
});

router.post('/', async (req, res) => {
	try {
		data = {};

		if (req.body.passwordChange) {
			data = await updatePassword(req.body.nickname, req.body.oldPassword, req.body.newPassword);
		} else if (req.body.emailChange) {
			data = await updateEmail(req.body.nickname);
		} else if (req.body.nicknameChange) {
			data = await updateNickname(req.body.nickname);
		} else if (req.body.deleteAccount) {
		}

		res.render('profile', data);
	} catch {
		res.status(500).send();
	}
});

async function updatePassword(nickname, currentPassword, newPassword) {
	let data = {};
	const user = await userController.findUserByNickname(nickname);

	if (await bcrypt.compare(currentPassword, user.password)) {
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(newPassword, salt);
		await userController.updatePassword(user, hashedPassword);

		data = { message: 'Password changed!' };
	} else {
		data = { error: 'Current password is incorrect!' };
	}

	return data;
}

async function updateEmail(nickname) {
	data = { message: 'Email changed!' };
	return data;
}

async function updateNickname(nickname) {
	data = { message: 'Nickname changed!' };
	return data;
}

module.exports = router;
