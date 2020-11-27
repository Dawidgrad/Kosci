const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();

// Create user
router.post('/', async (req, res) => {
	try {
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		const { nickname, email } = req.body;
		const response = await db.addUser({ nickname, password: hashedPassword, email });
		res.json(response).send();
	} catch {
		res.status(500).send();
	}
});

router.post('/login', async (req, res) => {
	const user = await db.findUserByEmail(req.body.email);
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
