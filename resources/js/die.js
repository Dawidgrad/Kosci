class Die {
	constructor(side) {
		if (side) {
			this.side = side;
		} else {
			this.roll();
		}
		this.generatePosition();
	}

	roll() {
		this.side = Math.ceil(Math.random() * 6);
	}

	generatePosition() {
		this.x = Math.ceil(Math.random() * 500);
		this.y = Math.ceil(Math.random() * 500);
	}
}

module.exports.Die = Die;
