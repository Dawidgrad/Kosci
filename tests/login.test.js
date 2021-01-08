// const express = require('express');
// const loginRouter = require('../routes/login');
const request = require('supertest');
const app = require('../server');

// const app = express();
// app.use('/login', loginRouter);

describe('Login integration testing', () => {
	test('Login get', async () => {
		const response = await request(app).get('/login');
		console.log(response.statusCode);
	});
});
