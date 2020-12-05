const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({ id: String, participants: String }, { collection: 'room' });
const Room = mongoose.model('room', roomSchema);

module.exports = Room;
