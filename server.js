const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const homeRouter = require('./routes/home');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

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

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/home', homeRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

app.listen(port, () => {
	console.log(`Server listening on ${port}`);
});
