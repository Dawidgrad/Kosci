$(() => {
	const socket = io();

	socket.emit('get list');

	socket.on('update list', (rooms) => {
		$('#roomList tr').remove();

		for (let i = 0; i < rooms.length; i++) {
			const name = rooms[i].name;
			const participants = rooms[i].participants.length;
			const status = rooms[i].inProgress ? 'In Progress' : 'Open';
			const disabled = rooms[i].inProgress || participants >= 4 ? 'disabled' : '';

			let row = `<tr class="table-row-height">
			<th>${name}</th>
			<th>${participants}/4</th>
			<th>${status}</th>
			<th><a class="btn-info btn full-width join-button ${disabled}" href="/game?name=${name}">Join</a></th>
			</tr>`;

			$('#roomList > tbody:last-child').append(row);
		}

		$('.join-button').click(() => {
			socket.emit('list change');
		});
	});

	$('#createRoom').click(() => {
		socket.emit('list change');
		socket.disconnect();
	});
});
