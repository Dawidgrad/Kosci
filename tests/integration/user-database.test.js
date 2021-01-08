const mongoose = require('mongoose');
const userController = require('../../controllers/user_controller');
const User = require('../../models/user');

describe('Database integration tests', () => {
	beforeAll(async () => {
		// Connect MongoDB
		mongoose.connect('mongodb://127.0.0.1/user', { useUnifiedTopology: true, useNewUrlParser: true });
		this.dbConnection = mongoose.connection;
	});

	beforeEach(async () => {
		this.testUser = new User({
			nickname: 'TestUser',
			password: 'TestPassword2$',
			email: 'testuser@gmail.com',
			wins: 5,
		});

		await this.testUser.save();
	});

	test('Find user by email', async () => {
		const user = await userController.findUserByEmail(this.testUser.email);

		expect(user.email).toBe(this.testUser.email);
		expect(user.nickname).toBe(this.testUser.nickname);
		expect(user.password).toBe(this.testUser.password);
		expect(user.wins).toBe(this.testUser.wins);
	});

	test('Find user by nickname', async () => {
		const user = await userController.findUserByEmail(this.testUser.nickname);

		expect(user.email).toBe(this.testUser.email);
		expect(user.nickname).toBe(this.testUser.nickname);
		expect(user.password).toBe(this.testUser.password);
		expect(user.wins).toBe(this.testUser.wins);
	});

	test('Add user', async () => {
		const userCount = (await User.find()).length;
		const data = {
			nickname: 'NewUser',
			password: 'NewPassword1£',
			email: 'newuser@gmail.com',
		};
		await userController.addUser(data);

		expect((await User.find()).length).toBe(userCount + 1);
	});

	test('Update user wins', async () => {
		await userController.updateUserWins(this.testUser);

		const updatedUser = await User.find({ email: this.testUser.email });

		expect(updatedUser.wins).toBe(this.testUser.wins + 1);
	});

	afterAll(() => {
		mongoose.disconnect();
	});

	afterEach(async () => {
		await User.deleteMany();
	});
});
