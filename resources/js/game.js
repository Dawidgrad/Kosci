$(() => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	const socket = io();

	// Create room, unless joining existing one
	if (urlParams.get('name') == '') {
		socket.emit('create room');
	} else {
		socket.emit('join room', urlParams.get('name'));
	}

	$('#startGame').click(() => {
		socket.emit('start game');
	});

	socket.on('room created', (name) => {
		history.pushState(null, null, `/game?name=${name}`);
	});

	socket.on('game started', () => {
		$('#message').html('The game has been started');
	});
});
