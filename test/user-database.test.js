const mongoose = require('mongoose');
const userController = require('../controllers/user_controller');
const User = require('../models/user');
const expect = require('chai').expect;

describe('User database integration tests', () => {
	before(async () => {
		// Connect MongoDB
		mongoose.Promise = global.Promise;
		mongoose.connect(process.env.MONGODB_URL, { useUnifiedTopology: true, useNewUrlParser: true });
		mongoose.connection.on('error', (error) => {
			console.warn('Error : ', error);
		});
	});

	beforeEach(async () => {
		this.testUser = new User({
			nickname: 'testuser',
			password: 'testpassword2$',
			email: 'testuser@gmail.com',
			wins: 5,
		});

		return this.testUser.save();
	});

	afterEach(async () => {
		await User.deleteMany({ email: 'newemail@gmail.com' });
		await User.deleteMany({ email: 'newuser@gmail.com' });
		return await User.deleteMany({ email: 'testuser@gmail.com' });
	});

	it('Find user by email', async () => {
		const user = await userController.findUserByEmail('testuser@gmail.com');

		expect(user.email).to.be.equal('testuser@gmail.com');
		expect(user.nickname).to.be.equal('testuser');
		expect(user.password).to.be.equal('testpassword2$');
		expect(user.wins).to.be.equal(5);
	});

	it('Find user by nickname', async () => {
		const user = await userController.findUserByNickname('testuser');

		expect(user.email).to.be.equal('testuser@gmail.com');
		expect(user.nickname).to.be.equal('testuser');
		expect(user.password).to.be.equal('testpassword2$');
		expect(user.wins).to.be.equal(5);
	});

	it('Add user', async () => {
		const userCount = (await User.find()).length;
		const data = {
			nickname: 'NewUser',
			password: 'testpassword2$',
			email: 'newuser@gmail.com',
		};
		await userController.addUser(data);

		expect(await User.find({ nickname: 'NewUser' })).to.not.be.null;
	});

	it('Update user wins', async () => {
		await userController.updateUserWins(this.testUser);
		const updatedUser = await User.findOne({ email: 'testuser@gmail.com' }).exec();

		expect(updatedUser.wins).to.equal(6);
	});

	it('Update user password', async () => {
		await userController.updatePassword(this.testUser, 'completelynewpassword');
		const updatedUser = await User.findOne({ email: 'testuser@gmail.com' }).exec();

		expect(updatedUser.password).to.equal('completelynewpassword');
	});

	it('Update user email', async () => {
		await userController.updateEmail(this.testUser, 'newemail@gmail.com');
		const updatedUser = await User.findOne({ nickname: 'testuser' }).exec();

		expect(updatedUser.email).to.equal('newemail@gmail.com');
	});

	it('Update user nickname', async () => {
		await userController.updateNickname(this.testUser, 'newuser');
		const updatedUser = await User.findOne({ email: 'testuser@gmail.com' }).exec();

		expect(updatedUser.nickname).to.equal('newuser');
	});

	it('Delete the user', async () => {
		await userController.deleteUser('testuser');
		expect(await User.find({ nickname: 'testuser' })).to.be.empty;
	});
});
