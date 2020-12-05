$(() => {
	const socket = io();

	socket.emit('join server', 'randomusernamefornowhehehe');

	$('#createRoom').click(() => {
		socket.disconnect();
	});
});
