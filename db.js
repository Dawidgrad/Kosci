const mongoose = require('mongoose');

// Schemas
const userSchema = new mongoose.Schema({ name: String, wins: Number, losses: Number }, { collection: 'koscidb' });

// Models
const User = mongoose.model('user', userSchema);

// Functions
async function listAllUsers() {
	const users = await User.find({});
	return users;
}

module.exports.listAllUsers = listAllUsers;
module.exports.User = User;
