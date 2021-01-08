const request = require('supertest');
const app = require('../../server').app;
const mongoose = require('mongoose');

describe('Login integration testing', () => {
	beforeAll((done) => {
		if (!mongoose.connection.db) {
			mongoose.connection.on('connected', done);
		} else {
			done();
		}
	}, 20000);

	test('Register GET', async () => {
		await request(app).get('/register').expect('Content-Type', /html/).expect(200);
	});

	test('Register POST', async (done) => {
		await request(app)
			.post('/register')
			.send({})
			.set('Accept', 'application/json')
			.expect('Content-Type', /html/)
			.expect(200);

		done();
	});

	test('Login GET', async () => {
		await request(app).get('/login').expect('Content-Type', /html/).expect(200);
	});

	test('Login POST', async () => {
		await request(app)
			.post('/login')
			.send({ email: 'testemail@gmail.com', password: 'testhash' })
			.set('Accept', 'application/json')
			.expect(302);
	});

	test('Game GET', async () => {
		await request(app).get('/game').expect('Content-Type', /plain/).expect(302);
	});

	test('Home GET', async () => {
		await request(app).get('/home').expect('Content-Type', /plain/).expect(302);
	});

	test('Profile GET', async () => {
		await request(app).get('/profile').expect('Content-Type', /plain/).expect(302);
	});

	test('Profile POST', async () => {
		await request(app)
			.post('/profile')
			.send({ email: 'testemail@gmail.com', password: 'testhash' })
			.set('Accept', 'application/json')
			.expect('Content-Type', /html/)
			.expect(200);
	});

	test('Logout GET', async () => {
		await request(app).get('/logout').expect(200);
	});
});
