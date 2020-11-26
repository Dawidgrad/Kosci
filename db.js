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

// Add data //
// const data = {
//     name: 'Dawid',
//     wins: 10,
//     losses: 1,
// };
// const newUser = new User(data);
// newUser.save((error) => {
//     if (error) {
//             console.log('Could not add the user');
//     } else {
//             console.log('Successfully added the user!');
//     }
// });
