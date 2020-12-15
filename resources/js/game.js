$(() => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	const socket = io();

	Images = {
		1: '../../images/dice-1.png',
		2: '../../images/dice-2.png',
		3: '../../images/dice-3.png',
		4: '../../images/dice-4.png',
		5: '../../images/dice-5.png',
		6: '../../images/dice-6.png',
	};

	// Create room, unless joining existing one
	if (urlParams.get('name') == '') {
		socket.emit('create room');
	} else {
		socket.emit('join room', urlParams.get('name'));
	}

	$('#startGame').click(() => {
		socket.emit('start game');
	});

	$('#rollDice').click(() => {
		socket.emit('roll dice', { toRoll: [1] });
	});

	socket.on('room created', (name) => {
		history.pushState(null, null, `/game?name=${name}`);
	});

	socket.on('next roll', async (data) => {
		$('#message').html(localStorage.nickname);

		const canvas = document.getElementById('game-canvas');
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (let i = 0; i < data.dice.length; i++) {
			const die = data.dice[i];
			const image = await getImage(die.side);
			ctx.drawImage(image, die.x, die.y);
		}
	});

	async function getImage(side) {
		let image;
		const imageLoadPromise = new Promise((resolve) => {
			image = new Image();
			image.src = Images[side];
			image.onload = resolve;
		});
		await imageLoadPromise;
		return image;
	}
});
