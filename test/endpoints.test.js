const app = require('../server').app;
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const session = require('express-session');

chai.use(chaiHttp);
app.use(session({ secret: process.env.SESSION_SECRET }));

describe('Login integration testing', () => {
	it('Register GET', () => {
		chai.request(app)
			.get('/register')
			.end((error, response) => {
				chai.assert.equal(response.status, 200, 'Wrong status code');
				chai.assert.equal(response.type, 'text/html', 'Wrong type');
			});
	});

	it('Register POST', () => {
		chai.request(app)
			.post('/register')
			.send({ email: 'registertest@gmail.com', nickname: 'RegisterTest', password: 'registertest' })
			.end((error, response) => {
				chai.assert.equal(response.status, 200, 'Wrong status code');
				chai.assert.equal(response.type, 'text/html', 'Wrong type');
				expect(response.text.search('User already exists!')).to.not.equal(-1);
			});
	});

	it('Login GET', () => {
		chai.request(app)
			.get('/login')
			.end((error, response) => {
				chai.assert.equal(response.status, 200, 'Wrong status code');
				chai.assert.equal(response.type, 'text/html', 'Wrong type');
			});
	});

	it('Login POST', () => {
		chai.request(app)
			.post('/login')
			.send({ email: 'invalidemail', password: 'invalidpassword' })
			.end((error, response) => {
				chai.assert.equal(response.status, 200, 'Wrong status code');
				chai.assert.equal(response.type, 'text/html', 'Wrong type');
				expect(response.text.search('Incorrect user credentials!')).to.not.equal(-1);
			});
	});

	it('Game GET', () => {
		chai.request(app)
			.get('/game')
			.end((error, response) => {
				chai.assert.equal(response.status, 200, 'Wrong status code');
				chai.assert.equal(response.type, 'text/html', 'Wrong type');
			});
	});

	it('Home GET', () => {
		chai.request(app)
			.get('/home')
			.end((error, response) => {
				chai.assert.equal(response.status, 200, 'Wrong status code');
				chai.assert.equal(response.type, 'text/html', 'Wrong type');
			});
	});

	it('Profile GET', () => {
		chai.request(app)
			.get('/profile')
			.end((error, response) => {
				chai.assert.equal(response.status, 200, 'Wrong status code');
				chai.assert.equal(response.type, 'text/html', 'Wrong type');
			});
	});

	it('Profile POST', () => {
		chai.request(app)
			.post('/profile')
			.send({
				nickname: 'ProfileTest',
			})
			.end((error, response) => {
				chai.assert.equal(response.status, 200, 'Wrong status code');
				chai.assert.equal(response.type, 'text/html', 'Wrong type');
			});
	});

	it('Logout GET', () => {
		chai.request(app)
			.get('/logout')
			.end((error, response) => {
				chai.assert.equal(response.status, 200, 'Wrong status code');
			});
	});
});
