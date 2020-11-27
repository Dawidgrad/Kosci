const mongoose = require('mongoose');

// Schemas
const userSchema = new mongoose.Schema(
	{ nickname: String, password: String, email: String, wins: Number, losses: Number },
	{ collection: 'user' }
);

// Models
const User = mongoose.model('user', userSchema);

// Functions
async function findUserByEmail(userEmail) {
	const user = await User.find({ email: userEmail });
	return user[0];
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

// Exports
module.exports.findUserByEmail = findUserByEmail;
module.exports.addUser = addUser;
module.exports.User = User;
