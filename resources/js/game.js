$(() => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	const socket = io();

	const IMAGE_WIDTH = 64;

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
		kosci: 'Kosci (Five of a kind)',
		chance: 'Chance',
	};

	let currentRoll;

	// Create room, unless joining existing one
	if (urlParams.get('name') == '') {
		socket.emit('create room', localStorage.nickname);
	} else {
		$('#rollDice').removeClass('d-none');
		$('#rollDice').prop('disabled', true);
		$('#startGame').addClass('d-none');
		socket.emit('join room', urlParams.get('name'), localStorage.nickname);
	}

	$('#game-state').html(`<b>Room name: ${urlParams.get('name')}</b>`);

	// Initialise canvas
	const canvas = document.getElementById('game-canvas');
	const ctx = canvas.getContext('2d');

	$('#startGame').click(() => {
		$('#rollDice').removeClass('d-none');
		$('#startGame').addClass('d-none');
		socket.emit('start game');
	});

	$('#rollDice').click(() => {
		// Check which dice are selected in order to keep them
		const indices = [];
		for (let i = 0; i < 5; i++) {
			if (currentRoll[i].selected === false) {
				indices.push(i);
			}
		}
		socket.emit('roll dice', { diceToRoll: indices });
	});

	$('#submitRoll').click(() => {
		const selectedRow = $('#selectRow')[0].innerHTML;
		const key = Object.keys(rowNames).find((key) => rowNames[key] === selectedRow);
		if (key) {
			const obj = {};
			obj['rowToSubmit'] = key;
			obj['nickname'] = localStorage.nickname;
			socket.emit('submit roll', obj);
			$('#selectRow')[0].innerHTML = 'Select row to submit';
		} else {
			addMessageToChat('System', 'Select a row to submit the score!');
		}
	});

	$('#sendMessage').click(() => {
		const messageBox = $('#messageBox');

		if (messageBox.val().trim() !== '') {
			const data = {
				nickname: localStorage.nickname,
				message: messageBox.val(),
			};

			messageBox.val('');

			socket.emit('new message', data);
		}
	});

	$('#messageBox').keyup(function (e) {
		if (e.which === 13) {
			$('#sendMessage').click();
		}
	});

	$('.dropdown-menu').on('click', 'a', function () {
		$('#selectRow:first-child').text($(this).text());
		$('#selectRow:first-child').val($(this).text());
	});

	$('#game-canvas').click((e) => {
		const x = e.offsetX;
		const y = e.offsetY;

		for (let i = 0; i < currentRoll.length; i++) {
			if (
				x > currentRoll[i].x &&
				x < currentRoll[i].x + IMAGE_WIDTH &&
				y > currentRoll[i].y &&
				y < currentRoll[i].y + IMAGE_WIDTH
			) {
				currentRoll[i].selected = !currentRoll[i].selected;
			}
		}

		drawDice(currentRoll, this.currentPlayer);
	});

	socket.on('room created', (name) => {
		history.pushState(null, null, `/game?name=${name}`);
		$('#game-state').html(`<b>Room name: ${urlParams.get('name')}</b>`);
	});

	socket.on('game started', () => {
		$('#game-canvas').removeClass('d-none');
		$('#scoreboard').removeClass('d-none');
		$('.score-submission').removeClass('d-none');
		$('#chat-area').css('height', '250px');
		$('#chat-area').css('margin-top', '0vh');
	});

	socket.on('game state update', (gameState) => {
		const currentPlayer = gameState.currentPlayer.nickname;
		const rollsLeft = gameState.rollsLeft;
		const scoreboards = gameState.scoreboards;

		for (let i = 0; i < 5; i++) {
			if (currentRoll && rollsLeft < 2) {
				if (currentRoll[i].selected) {
					gameState.currentRoll[i].selected = true;
				} else {
					gameState.currentRoll[i].selected = false;
				}
			} else {
				gameState.currentRoll[i].selected = false;
			}
		}

		currentRoll = gameState.currentRoll;
		this.currentPlayer = currentPlayer;

		drawDice(currentRoll, currentPlayer);
		loadScoreboards(scoreboards);
		updateRowSelection(scoreboards);
		$('#game-state').html(`<b>${currentPlayer}'s turn</br>Rolls left: ${rollsLeft}</b>`);

		// Control UI
		if (currentPlayer !== localStorage.nickname) {
			$('#rollDice').prop('disabled', true);
			$('#submitRoll').prop('disabled', true);
		} else {
			$('#rollDice').prop('disabled', false);
			$('#submitRoll').prop('disabled', false);
		}
	});

	socket.on('game ended', (gameState) => {
		$('#rollDice').prop('disabled', true);
		$('#submitRoll').prop('disabled', true);
		$('.score-submission').addClass('d-none');

		const scoreboards = gameState.scoreboards;
		loadScoreboards(scoreboards);
		updateRowSelection(scoreboards);
		addFinalScore(scoreboards);

		// Show the winner alert
		const winnerAlert = $('#winner-alert');
		winnerAlert.removeClass('d-none');
		winnerAlert.text(`${gameState.winner} has won the game!`);
	});

	socket.on('update messages', (data) => {
		if (data.nickname === 'System') {
			// Server feedback
			addMessageToChat(data.nickname, data.message, 'green');
		} else {
			// Regular messages
			addMessageToChat(data.nickname, data.message);
		}
	});

	async function drawDice(roll, currentPlayer) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw dice and borders around them if selected
		for (let i = 0; i < roll.length; i++) {
			const die = roll[i];
			const image = await getImage(die.side);
			ctx.drawImage(image, die.x, die.y);

			if (die.selected) {
				ctx.beginPath();
				ctx.lineWidth = '3';
				ctx.strokeStyle = 'red';
				ctx.rect(die.x - 5, die.y - 5, IMAGE_WIDTH + 10, IMAGE_WIDTH + 10);
				ctx.stroke();
				ctx.closePath();
			}
		}

		// Draw border indicating whose turn it is
		ctx.beginPath();
		ctx.lineWidth = '12';

		if (currentPlayer !== localStorage.nickname) {
			ctx.strokeStyle = 'red';
		} else {
			ctx.strokeStyle = 'green';
		}

		ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.stroke();
		ctx.closePath();
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

		// Clear the scoreboard table
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

	function addFinalScore(scoreboards) {
		const table = $('#scoreboard')[0];
		const row = table.insertRow();
		let rowName = row.insertCell();
		rowName.innerHTML = `<b style="color:red">Total</b>`;

		for (const item in scoreboards) {
			let finalScore = row.insertCell();
			finalScore.innerHTML = `<b>${scoreboards[item].finalScore}</b>`;
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
				$(`#${keys[key]}`).addClass('d-none');
			}
		}
	}

	function addMessageToChat(nickname, message, color) {
		const chatBox = $('#chat-box');

		if (color) {
			// Messages with pre-defined colour
			chatBox.append(`<p style="color:${color}"><b>${nickname}:</b> ${message}</p>`);
		} else {
			if (nickname === 'System') {
				// Error messages
				chatBox.append(`<p style="color:red"><b>${nickname}:</b> ${message}</p>`);
			} else {
				// Regular messages
				chatBox.append(`<p><b>${nickname}:</b> ${message}</p>`);
			}
		}

		// Scroll chat to the latest message
		$('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
	}
});
