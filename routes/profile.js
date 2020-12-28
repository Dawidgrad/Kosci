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
			res.render('profile', data);
		} else if (req.body.emailChange) {
			data = await updateEmail(req.body.nickname, req.body.oldEmail, req.body.newEmail);
			res.render('profile', data);
		} else if (req.body.nicknameChange) {
			data = await updateNickname(req.body.nickname, req.body.newNickname);
			res.render('profile', data);
		} else if (req.body.deleteAccount) {
			console.log(req.body.nickname);
			await userController.deleteUser(req.body.nickname);
			res.redirect('/logout');
		}
	} catch (ex) {
		console.log(ex);
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

async function updateEmail(nickname, currentEmail, newEmail) {
	let data = {};
	const user = await userController.findUserByNickname(nickname);

	if (user.email === currentEmail) {
		const emailUpdated = await userController.updateEmail(user, newEmail);

		if (emailUpdated) {
			data = { message: 'Email changed!' };
		} else {
			data = { error: 'Email already exists in the system!' };
		}
	} else {
		data = { error: 'Current email is incorrect!' };
	}

	return data;
}

async function updateNickname(nickname, newNickname) {
	let data = {};
	const user = await userController.findUserByNickname(nickname);

	const nicknameUpdated = await userController.updateNickname(user, newNickname);

	if (nicknameUpdated) {
		data = { message: 'Nickname changed! Re-log to apply the changes.' };
	} else {
		data = { error: 'Nickname already exists in the system!' };
	}

	return data;
}

module.exports = router;
