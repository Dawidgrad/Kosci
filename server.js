const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db');

// Specify the port
const port = process.env.PORT || 9000;

// Connect MongoDB
const MONGODB_URI = 'mongodb+srv://dawidgrad:YubiYubi@university.vbira.mongodb.net/koscidb?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true });

// Initialise ExpressJs
const app = express();

// Set the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Specify static path
app.use(express.static(path.join(__dirname, 'resources')));

// Routes
app.get('/users', async (req, res) => {
	const users = await db.listAllUsers();
	const data = { retrievedUsers: users };
	res.json(data);
	// res.render('pagename', data) in case of a view - ejs file
});

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
app.post('/api/user', async (req, res) => {
	const { nickname, password, email } = req.body;
	const response = await db.addUser({ nickname, password, email });
	res.json(response).send();
});

// Find by email
app.post('/api/user', async (req, res) => {
	const user = await db.findUserByEmail(req.params.email);
	const data = { retrievedUsers: user };
	res.json(data);
});

app.listen(port, () => {
	console.log(`Server listening on ${port}`);
});
