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

	const newUser = new User(user);
	newUser.save((error) => {
		if (error) {
			console.log('Could not add the user');
		}
	});
}

async function updateUserWins(user) {
	user.wins += 1;
	return user.save();
}

async function updatePassword(user, newPassword) {
	user.password = newPassword;
	return user.save();
}

async function updateEmail(user, newEmail) {
	let emailUpdated = false;

	if (await findUserByEmail(newEmail)) {
		emailUpdated = false;
	} else {
		user.email = newEmail;
		await user.save();
		emailUpdated = true;
	}

	return emailUpdated;
}

async function updateNickname(user, newNickname) {
	let nicknameUpdated = false;

	if (await findUserByNickname(newNickname)) {
		nicknameUpdated = false;
	} else {
		user.nickname = newNickname;
		await user.save();
		nicknameUpdated = true;
	}

	return nicknameUpdated;
}

async function deleteUser(nickname) {
	return await User.deleteOne({ nickname: nickname }, (error) => {
		if (error) {
			console.log(error);
		}
	});
}

module.exports.findUserByEmail = findUserByEmail;
module.exports.findUserByNickname = findUserByNickname;
module.exports.addUser = addUser;
module.exports.updateUserWins = updateUserWins;
module.exports.updatePassword = updatePassword;
module.exports.updateEmail = updateEmail;
module.exports.updateNickname = updateNickname;
module.exports.deleteUser = deleteUser;
