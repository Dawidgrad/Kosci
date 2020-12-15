const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
	{ name: String, participants: [{ nickname: String }], inProgress: Boolean },
	{ collection: 'room' }
);
const Room = mongoose.model('room', roomSchema);

module.exports = Room;
