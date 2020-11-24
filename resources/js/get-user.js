const http = require('http');
const mongoose = require('mongoose');

const url = 'mongodb+srv://dawidgrad:<password>@cluster0.vbira.mongodb.net/<dbname>?retryWrites=true&w=majority';

// Connect to the Mongo database
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });

// Define schema
const User = mongoose.model('user', {
	name: String,
	wins: Number,
	losses: Number,
});

const server = http.createServer((request, response) => {
	User.find({}, (err, docs) => {
		response.setHeader('content-type', 'text/json');
		response.end(JSON.stringify({ user: docs }));
	});
});
