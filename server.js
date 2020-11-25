const { response } = require('express');
const express = require('express');
const { request } = require('http');
const mongoose = require('mongoose');
const path = require('path');
const db = require('./db');
const { User } = require('./db');

// Specify the port
const port = process.env.PORT || 9000;

// Connect MongoDB
const MONGODB_URI = 'mongodb+srv://dawidgrad:YubiYubi@university.vbira.mongodb.net/koscidb?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true });

// Add some data
// const data = {
// 	name: 'Dawid',
// 	wins: 10,
// 	losses: 1,
// };
// const newUser = new User(data);
// newUser.save((error) => {
// 	if (error) {
// 		console.log('Could not add the user');
// 	} else {
// 		console.log('Successfully added the user!');
// 	}
// });

const app = express();

// Set the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
	// const pageData = {};
	res.render('home');
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.get('/register', (req, res) => {
	res.render('register');
});

app.listen(port, () => {
	console.log(`Server listening on ${port}`);
});
