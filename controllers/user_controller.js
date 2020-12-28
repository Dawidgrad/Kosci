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

async function updatePassword(user, newPassword) {
	user.password = newPassword;
	user.save((error) => {
		if (error) {
			console.log("Could not update user's password!");
		}
	});
}

async function updateEmail(user, newEmail) {
	let emailUpdated = false;

	if (await findUserByEmail(newEmail)) {
		emailUpdated = false;
	} else {
		user.email = newEmail;
		user.save((error) => {
			if (error) {
				console.log("Could not update user's password!");
			}
		});
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
		user.save((error) => {
			if (error) {
				console.log("Could not update user's password!");
			}
		});
		nicknameUpdated = true;
	}

	return nicknameUpdated;
}

async function deleteUser(nickname) {
	User.deleteOne({ nickname: nickname }, (error) => {
		if (error) {
			console.log(error);
		}
	});
}

module.exports.findUserByEmail = findUserByEmail;
module.exports.findUserByNickname = findUserByNickname;
module.exports.addUser = addUser;
module.exports.updatePassword = updatePassword;
module.exports.updateEmail = updateEmail;
module.exports.updateNickname = updateNickname;
module.exports.deleteUser = deleteUser;
