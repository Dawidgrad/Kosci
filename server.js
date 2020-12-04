const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const homeRouter = require('./routes/home');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const logoutRouter = require('./routes/logout');
const gameRouter = require('./routes/game');

const session = require('express-session');

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
// app.set('layout', 'layouts/layout');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: process.env.SESSION_SECRET }));

// Specify static path
app.use(express.static(path.join(__dirname, 'resources')));

app.use('/', indexRouter);
app.use('/home', homeRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);
app.use('/game', gameRouter);

app.listen(port, () => {
	console.log(`Server listening on ${port}`);
});
