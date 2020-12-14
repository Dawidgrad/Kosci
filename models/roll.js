const mongoose = require('mongoose');

const rollSchema = new mongoose.Schema(
	{ roomName: String, player: String, dice: [{ side: Number, x: Number, y: Number }] },
	{ collection: 'roll' }
);
const Roll = mongoose.model('roll', rollSchema);

module.exports = Roll;
