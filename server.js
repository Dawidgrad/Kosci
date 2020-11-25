const express = require('express');
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

// Routes
app.get('/users', async (request, response) => {
	const users = await db.listAllUsers();
	const data = { retrievedUsers: users };
	response.json(data);
	// response.render('pagename', data) in case of a view - ejs file
});

app.listen(port, () => {
	console.log(`Server listening on ${port}`);
});
