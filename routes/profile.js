const express = require('express');
const bcrypt = require('bcrypt');
const userController = require('../controllers/user_controller');
const scoreboardController = require('../controllers/scoreboard_controller');

const router = express.Router();

router.get('/', async (req, res) => {
	if (req.session.loggedIn) {
		const user = await userController.findUserByNickname(req.session.nickname);
		user.scoreboards = await scoreboardController.findUserScoreboards(req.session.nickname);
		res.render('profile', user);
	} else {
		res.redirect('/login');
	}
});

router.post('/', async (req, res) => {
	try {
		const user = await userController.findUserByNickname(req.session.nickname);
		const scoreboards = { scoreboards: await scoreboardController.findUserScoreboards(req.session.nickname) };
		const userInfo = Object.assign(user, scoreboards);

		// User decided to delete the account
		if (req.body.deleteAccount) {
			await userController.deleteUser(req.body.nickname);
			res.redirect('/logout');
		} else {
			feedback = {};

			// User decided to change details
			if (req.body.passwordChange) {
				feedback = await updatePassword(req.body.nickname, req.body.oldPassword, req.body.newPassword);
			} else if (req.body.emailChange) {
				feedback = await updateEmail(req.body.nickname, req.body.oldEmail, req.body.newEmail);
			} else if (req.body.nicknameChange) {
				feedback = await updateNickname(req.body.nickname, req.body.newNickname);
				scoreboardController.updateScoreboardsPlayerName(req.body.nickname, req.body.newNickname);
			}

			const data = Object.assign(userInfo, feedback);
			res.render('profile', data);
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
	let feedback = {};
	const user = await userController.findUserByNickname(nickname);

	if (user.email === currentEmail) {
		const emailUpdated = await userController.updateEmail(user, newEmail);

		if (emailUpdated) {
			feedback = { message: 'Email changed!' };
		} else {
			feedback = { error: 'Email already exists in the system!' };
		}
	} else {
		feedback = { error: 'Current email is incorrect!' };
	}

	return feedback;
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
