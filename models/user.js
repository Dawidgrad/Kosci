const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{ nickname: String, password: String, email: String, wins: Number },
	{ collection: 'user' }
);
const User = mongoose.model('user', userSchema);

module.exports = User;
