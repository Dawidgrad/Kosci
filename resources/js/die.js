const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

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
		this.x = Math.ceil(Math.random() * (CANVAS_WIDTH - 100));
		this.y = Math.ceil(Math.random() * (CANVAS_HEIGHT - 100));
	}
}

module.exports.Die = Die;
