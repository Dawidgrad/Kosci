const mongoose = require('mongoose');
const roomController = require('../controllers/room_controller');
const Room = require('../models/room');
const expect = require('chai').expect;

describe('Room database integration tests', () => {
	before(async () => {
		// Connect MongoDB
		mongoose.Promise = global.Promise;
		mongoose.connect(process.env.MONGODB_URL, { useUnifiedTopology: true, useNewUrlParser: true });
		mongoose.connection.on('error', (error) => {
			console.warn('Error : ', error);
		});
	});

	beforeEach(async () => {
		this.testRoomA = new Room({
			name: 'testroomA',
			participants: [{ nickname: 'participant1A' }, { nickname: 'participant2A' }, { nickname: 'participant3A' }],
			inProgress: true,
		});

		this.testRoomB = new Room({
			name: 'testroomB',
			participants: [{ nickname: 'participant1B' }, { nickname: 'participant2B' }, { nickname: 'participant3B' }],
			inProgress: false,
		});

		this.testRoomA.save();
		return this.testRoomB.save();
	});

	afterEach(async () => {
		return await Room.deleteMany();
	});

	it('Find all rooms', async () => {
		const rooms = await roomController.findAllRooms();
		expect(rooms.length).to.be.equal(2);
	});

	it('Find room by name', async () => {
		const room = await roomController.findRoomByName('testroomA');
		expect(room.name).to.be.equal('testroomA');
		expect(room.participants[0].nickname).to.equal('participant1A');
		expect(room.participants[1].nickname).to.equal('participant2A');
		expect(room.participants[2].nickname).to.equal('participant3A');
		expect(room.inProgress).to.be.true;
	});

	it('Update room progress', async () => {
		await roomController.updateRoomProgress('testroomB', true);
		const updatedRoom = await Room.findOne({ name: 'testroomB' }).exec();

		expect(updatedRoom.inProgress).to.be.true;
	});

	it('Delete room', async () => {
		await roomController.deleteRoom('testroomB');
		const rooms = await Room.find().exec();

		expect(rooms.length).to.be.equal(1);
	});

	it('Create room', async () => {
		const newRoomId = await roomController.createRoom('participant1C');
		const newRoom = await Room.findOne({ name: newRoomId }).exec();

		expect(newRoom.name).to.be.equal(newRoomId);
		expect(newRoom.participants[0].nickname).to.equal('participant1C');
		expect(newRoom.inProgress).to.be.false;
	});

	it('Register user', async () => {
		await roomController.registerUser('testroomB', 'participant4B');
		const room = await Room.findOne({ name: 'testroomB' }).exec();

		expect(room.participants.length).to.equal(4);
		expect(room.participants[3].nickname).to.equal('participant4B');
	});
});
