$(() => {
	const socket = io();

	socket.emit('get room list');

	socket.on('update room list', (rooms) => {
		for (let i = 0; i < rooms.length; i++) {
			const name = rooms[i].name;
			const participants = rooms[i].participants.length;
			const status = rooms[i].inProgress ? 'In Progress' : 'Open';
			const disabled = rooms[i].inProgress ? 'disabled' : '';

			let row = `<tr class="table-row-height">
			<th>${name}</th>
			<th>${participants}/4</th>
			<th>${status}</th>
			<th><a class="btn-info btn full-width ${disabled}" href="/game?name=${name}">Join</a></th>
			</tr>`;

			$('#roomList > tbody:last-child').append(row);
		}
		console.log(rooms);
	});

	$('#createRoom').click(() => {
		socket.emit('new room created');
		socket.disconnect();
	});
});
