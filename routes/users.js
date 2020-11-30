const express = require('express');
const bcrypt = require('bcrypt');
const model = require('../models/user');

const router = express.Router();

async function findUserByEmail(userEmail) {
	const user = await model.findOne({ email: userEmail });
	return user;
}

async function addUser(data) {
	const user = data;
	user.wins = 0;
	user.losses = 0;

	const newUser = new model.User(user);
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

// Login user
router.post('/login', async (req, res) => {
	const user = await findUserByEmail(req.body.email);
	if (user === undefined) {
		res.status(400).send('Cannot find user');
	}

	try {
		// Prevents timing attacks
		if (await bcrypt.compare(req.body.password, user.password)) {
			res.send('Success');
		} else {
			res.send('Not Allowed');
		}
	} catch {
		res.status(500).send();
	}
});

module.exports = router;
