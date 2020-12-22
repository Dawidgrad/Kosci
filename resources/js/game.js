$(() => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	const socket = io();

	const images = {
		1: '../../images/dice-1.PNG',
		2: '../../images/dice-2.PNG',
		3: '../../images/dice-3.PNG',
		4: '../../images/dice-4.PNG',
		5: '../../images/dice-5.PNG',
		6: '../../images/dice-6.PNG',
	};

	const rowNames = {
		ones: 'Ones',
		twos: 'Twos',
		threes: 'Threes',
		fours: 'Fours',
		fives: 'Fives',
		sixes: 'Sixes',
		pair: 'Pair',
		twoPairs: 'Two Pairs',
		smallStraight: 'Small Straight',
		largeStraight: 'Large Straight',
		threeKind: 'Three of a kind',
		fullHouse: 'Full House',
		fourKind: 'Four of a kind',
		kosci: 'Kosci',
		chance: 'Chance',
	};

	let currentRoll;

	// Create room, unless joining existing one
	if (urlParams.get('name') == '') {
		socket.emit('create room', localStorage.nickname);
	} else {
		socket.emit('join room', urlParams.get('name'), localStorage.nickname);
	}

	// Initialise canvas
	const canvas = document.getElementById('game-canvas');
	const ctx = canvas.getContext('2d');

	$('#startGame').click(() => {
		socket.emit('start game');
	});

	$('#rollDice').click(() => {
		socket.emit('roll dice', { diceToRoll: [1, 2] });
	});

	$('#submitRoll').click(() => {
		const selectedRow = $('#selectRow')[0].innerHTML;
		const key = Object.keys(rowNames).find((key) => rowNames[key] === selectedRow);
		if (key) {
			const obj = {};
			obj['rowToSubmit'] = key;
			obj['nickname'] = localStorage.nickname;
			socket.emit('submit roll', obj);
		} else {
			console.log('Select a row to submit the score');
		}
	});

	$('.dropdown-menu').on('click', 'a', function () {
		$('#selectRow:first-child').text($(this).text());
		$('#selectRow:first-child').val($(this).text());
	});

	$('#game-canvas').click((e) => {
		const x = e.offsetX;
		const y = e.offsetY;
		const imageWidth = 64;

		for (let i = 0; i < currentRoll.length; i++) {
			if (
				x > currentRoll[i].x &&
				x < currentRoll[i].x + imageWidth &&
				y > currentRoll[i].y &&
				y < currentRoll[i].y + imageWidth
			) {
				console.log('hello?');
			}
		}
	});

	socket.on('room created', (name) => {
		history.pushState(null, null, `/game?name=${name}`);
	});

	socket.on('game state update', (gameState) => {
		const roll = gameState.currentRoll;
		const scoreboards = gameState.scoreboards;
		const currentPlayer = gameState.currentPlayer.nickname;
		const rollsLeft = gameState.rollsLeft;
		const roundCount = gameState.roundCount;

		drawDice(roll);
		loadScoreboards(scoreboards);
		updateRowSelection(scoreboards);
		$('#current-player').html(`Current turn: ${currentPlayer}`);
		$('#rolls-left').html(`Rolls left ${rollsLeft}`);
		$('#round-count').html(`Round ${roundCount}`);
	});

	socket.on('game ended', (gameState) => {
		// Show the winner alert
		const winnerAlert = $('#winner-alert');
		winnerAlert.removeClass('d-none');
		winnerAlert.text(`${gameState.winner} has won the game!`);
	});

	async function drawDice(roll) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (let i = 0; i < roll.length; i++) {
			const die = roll[i];
			const image = await getImage(die.side);
			ctx.drawImage(image, die.x, die.y);
		}
	}

	async function getImage(side) {
		let image;
		const imageLoadPromise = new Promise((resolve) => {
			image = new Image();
			image.src = images[side];
			image.onload = resolve;
		});
		await imageLoadPromise;
		return image;
	}

	function loadScoreboards(scoreboards) {
		// Get the list of scoreboard keys
		const keys = [];
		Object.keys(rowNames).forEach((e) => {
			keys.push(e);
		});

		// CLear the scoreboard table
		$('#scoreboard > tbody').html('');

		const table = $('#scoreboard')[0];

		// Add player names to the table
		const row = table.insertRow();
		row.insertCell();

		for (const item in scoreboards) {
			let score = row.insertCell();
			score.innerHTML = `<b>${scoreboards[item]['player']}</b>`;
		}

		// Fill the scoreboard table with current scores
		for (const key in keys) {
			const row = table.insertRow();
			let rowName = row.insertCell();
			rowName.innerHTML = `<b>${rowNames[keys[key]]}</b>`;

			for (const item in scoreboards) {
				let score = row.insertCell();
				if (scoreboards[item].scores[keys[key]] === undefined) {
					score.innerHTML = '';
				} else {
					score.innerHTML = scoreboards[item].scores[keys[key]];
				}
			}
		}
	}

	function updateRowSelection(scoreboards) {
		// Find user's scoreboard by comparing nicknames
		let scoreboard;
		for (const item in scoreboards) {
			if (localStorage.nickname === scoreboards[item]['player']) {
				scoreboard = scoreboards[item];
			}
		}

		// Get the list of scoreboard keys
		const keys = [];
		Object.keys(rowNames).forEach((e) => {
			keys.push(e);
		});

		// Disable selections that are not empty in the selection
		for (const key in keys) {
			if (scoreboard.scores[keys[key]] !== null) {
				$(`#${keys[key]}`).addClass('disabled');
			}
		}
	}
});
