$(() => {
	const socket = io();
	let listIndex = 0;
	let rooms = [];

	socket.emit('get list');

	socket.on('update list', (rooms) => {
		this.rooms = rooms;

		fillRoomList(this.rooms);

		if (listIndex === 0) {
			$('#previousButton').prop('disabled', true);
		}

		if (this.rooms.length <= 10) {
			$('#nextButton').prop('disabled', true);
		}

		$('.join-button').click(() => {
			socket.emit('list change');
		});
	});

	$('#createRoom').click(() => {
		socket.emit('list change');
		socket.disconnect();
	});

	$('#previousButton').click(() => {
		listIndex -= 10;
		fillRoomList(this.rooms);

		$('#nextButton').prop('disabled', false);

		if (listIndex === 0) {
			$('#previousButton').prop('disabled', true);
		}
	});

	$('#nextButton').click(() => {
		listIndex += 10;
		fillRoomList(this.rooms);

		$('#previousButton').prop('disabled', false);

		if (listIndex + 10 >= this.rooms.length) {
			$('#nextButton').prop('disabled', true);
		}
	});

	function fillRoomList(rooms) {
		$('#roomList tr').remove();

		let indexLimit = listIndex + 10 < rooms.length ? listIndex + 10 : rooms.length;

		for (let i = listIndex; i < indexLimit; i++) {
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
	}
});
