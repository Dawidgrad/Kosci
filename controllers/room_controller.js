const Room = require('../models/room');

async function findAllRooms() {
	const rooms = await Room.find().exec();
	return rooms;
}

async function findRoomByName(name) {
	const room = await Room.findOne({ name: name }).exec();
	return room;
}

async function updateRoomProgress(name, progress) {
	const room = await findRoomByName(name);
	room.inProgress = progress;
	return room.save();
}

async function deleteRoom(name) {
	return await Room.deleteOne({ name: name });
}

function generateId() {
	var S4 = function () {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	return S4() + S4();
}

async function createRoom(nickname) {
	const newId = generateId();
	const data = {
		name: newId,
		participants: [{ nickname: nickname }],
		inProgress: false,
	};

	const newRoom = new Room(data);
	await newRoom.save();
	return newId;
}

async function registerUser(roomName, nickname) {
	const room = await findRoomByName(roomName);
	const participants = room.participants;
	let joinedRoom = false;

	if (participants.filter((e) => e.nickname === nickname).length === 0) {
		participants.push({ nickname: nickname });

		room.update({ _id: room._id }, { participants: participants });
		await room.save();

		joinedRoom = true;
	}

	return joinedRoom;
}

module.exports.findAllRooms = findAllRooms;
module.exports.findRoomByName = findRoomByName;
module.exports.createRoom = createRoom;
module.exports.updateRoomProgress = updateRoomProgress;
module.exports.registerUser = registerUser;
module.exports.deleteRoom = deleteRoom;
