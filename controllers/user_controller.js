const User = require('../models/user');

async function findUserByEmail(userEmail) {
	const user = await User.findOne({ email: userEmail }).exec();
	return user;
}

async function findUserByNickname(userNickname) {
	const user = await User.findOne({ nickname: userNickname }).exec();
	return user;
}

async function addUser(data) {
	const user = data;
	user.wins = 0;
	user.losses = 0;

	const newUser = new User(user);
	newUser.save((error) => {
		if (error) {
			console.log('Could not add the user');
		} else {
			console.log('Successfully added the user!');
		}
	});
}

module.exports.findUserByEmail = findUserByEmail;
module.exports.findUserByNickname = findUserByNickname;
module.exports.addUser = addUser;
