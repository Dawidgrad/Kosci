// const express = require('express');
// const loginRouter = require('../routes/login');
const request = require('supertest');
const app = require('../server').app;
const mongoose = require('mongoose');

// const app = express();
// app.use('/login', loginRouter);

describe('Login integration testing', () => {
	beforeAll((done) => {
		if (!mongoose.connection.db) {
			mongoose.connection.on('connected', done);
		} else {
			done();
		}
	}, 20000);

	test('Login get', async () => {
		const response = await request(app).get('/login');
		console.log(response.statusCode);
	});
});
