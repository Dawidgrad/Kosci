const mongoose = require('mongoose');
const scoreboardController = require('../controllers/scoreboard_controller');
const Scoreboard = require('../models/scoreboard');
const expect = require('chai').expect;

describe('Scoreboard database integration tests', () => {
	before(async () => {
		// Connect MongoDB
		mongoose.Promise = global.Promise;
		const db = mongoose.createConnection(process.env.MONGODB_URL, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});
		db.on(`error`, console.error.bind(console, `connection error:`));
		db.once(`open`, function () {
			console.log(`MongoDB connected`);
		});
	});

	beforeEach(async () => {
		this.testScoreboardA = new Scoreboard({
			participants: ['participant1', 'participant2'],
			player: 'participant1',
			score: 135,
			winner: false,
		});

		this.testScoreboardB = new Scoreboard({
			participants: ['participant1', 'participant2'],
			player: 'participant2',
			score: 208,
			winner: true,
		});

		this.testScoreboardA.save();
		return this.testScoreboardB.save();
	});

	afterEach(async () => {
		return await Scoreboard.deleteMany();
	});

	it('Find user scoreboards', async () => {
		const scoreboards = await scoreboardController.findUserScoreboards('participant1');
		expect(scoreboards.length).to.be.equal(1);
		expect(scoreboards[0].score).to.be.equal(135);
		expect(scoreboards[0].winner).to.be.false;
		expect(scoreboards[0].participants[0]).to.be.equal('participant1');
		expect(scoreboards[0].participants[1]).to.be.equal('participant2');
	});

	it('Submit scoreboards', async () => {
		const scoreboards = [
			{ player: 'participant1', finalScore: 305 },
			{ player: 'participant2', finalScore: 201 },
		];

		await scoreboardController.submitScoreboards(scoreboards, 'participant1');

		let userScoreboards = await scoreboardController.findUserScoreboards('participant1');
		expect(userScoreboards.length).to.be.equal(2);
		expect(userScoreboards[1].score).to.be.equal(305);
		expect(userScoreboards[1].winner).to.be.true;

		userScoreboards = await scoreboardController.findUserScoreboards('participant2');
		expect(userScoreboards.length).to.be.equal(2);
		expect(userScoreboards[1].score).to.be.equal(201);
		expect(userScoreboards[1].winner).to.be.false;
	});

	it('Create scoreboard', async () => {
		await scoreboardController.createScoreboard(
			'participant2',
			['participant1, participant2, participant3'],
			173,
			true
		);

		const userScoreboards = await scoreboardController.findUserScoreboards('participant2');
		expect(userScoreboards.length).to.be.equal(2);
		expect(userScoreboards[1].score).to.be.equal(173);
		expect(userScoreboards[1].winner).to.be.true;
	});

	it('Update scoreboards with new player name', async () => {
		await scoreboardController.updateScoreboardsPlayerName('participant1', 'participantA');

		let userScoreboards = await scoreboardController.findUserScoreboards('participantA');
		expect(userScoreboards.length).to.be.equal(1);

		userScoreboards = await scoreboardController.findUserScoreboards('participant1');
		expect(userScoreboards.length).to.be.equal(0);
	});
});
