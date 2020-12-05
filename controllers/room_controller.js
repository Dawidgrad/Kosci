const Room = require('../models/room');

async function findAllRooms() {
	const rooms = await Room.find().exec();
	return rooms;
}

async function findRoomById(id) {
	const room = await Room.findOne({ id: id }).exec();
	return room;
}

function generateId() {
	var S4 = function () {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	return S4() + S4();
}

async function createRoom(roomSize) {
	const newId = generateId();
	const data = {
		id: newId,
		participants: 1,
		size: roomSize,
	};

	const newRoom = new Room(data);
	await newRoom.save((error) => {
		if (error) {
			console.log('Could not create the room');
		} else {
			console.log('Successfully created the room!');
		}
	});
	return newId;
}

module.exports.findRoomById = findRoomById;
module.exports.createRoom = createRoom;
