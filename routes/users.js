const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

async function findUserByEmail(userEmail) {
	const user = await User.findOne({ email: userEmail }).exec();
	return user;
}

async function addUser(data) {
	const user = data;
	user.wins = 0;
	user.losses = 0;

	const newUser = new User(user);
	newUser.save((error) => {
		if (error) {
			console.log('Could not add the user');
		} else {
			console.log('Successfully added the user!');
		}
	});
}

// Create user
router.post('/new', async (req, res) => {
	try {
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		const { nickname, email } = req.body;
		const response = await addUser({ nickname, password: hashedPassword, email });
		res.json(response).send();
	} catch {
		res.status(500).send();
	}
});

// Authenticate user
router.post('/auth', async (req, res) => {
	const user = await findUserByEmail(req.body.email);
	if (user === undefined) {
		res.status(400).send('Cannot find user');
	}

	try {
		// Prevents timing attacks
		if (await bcrypt.compare(req.body.password, user.password)) {
			console.log('sdisamdoiasndasndndianj');
			req.session.loggedIn = true;
			req.session.email = req.body.email;
			res.redirect('/home');
		} else {
			res.send('Not Allowed');
		}
		res.end();
	} catch {
		res.status(500).send();
	}
});

module.exports = router;
