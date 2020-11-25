const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ nickname: String, password: String });
const User = mongoose.model('user', userSchema);

async function listAllUsers() {
	const users = await User.find({});
	return users;
}

module.exports.listAllUsers = listAllUsers;
