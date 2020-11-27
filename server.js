const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('./db');

const indexRouter = require('./routes/index');

if (process.env.NODE_ENV !== 'production') {
	// eslint-disable-next-line global-require
	require('dotenv').config();
}

// Specify the port
const port = process.env.PORT || 9000;

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URL, { useUnifiedTopology: true, useNewUrlParser: true });
const dbConnection = mongoose.connection;
dbConnection.on('error', (error) => console.error(error));
dbConnection.once('open', () => console.log('Connected to MongoDB'));

// Initialise ExpressJs
const app = express();

// Set the view engine and layouts
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Specify static path
app.use(express.static(path.join(__dirname, 'resources')));

// Routes
app.use('/', indexRouter);

app.get('/home', (req, res) => {
	res.render('home');
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.get('/register', (req, res) => {
	res.render('register');
});

// Create user
app.post('/api/users', async (req, res) => {
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

app.post('/api/users/login', async (req, res) => {
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

app.listen(port, () => {
	console.log(`Server listening on ${port}`);
});
