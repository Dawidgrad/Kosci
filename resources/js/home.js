$(() => {
	const socket = io();

	socket.emit('join server', 'randomusernamefornowhehehe');
});
