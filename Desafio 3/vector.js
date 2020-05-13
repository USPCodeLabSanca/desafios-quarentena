class Vector {
	constructor (x, y) {
		this.x = x;
		this.y = y;
	}

	add (otherVector) {
		return new Vector(this.x + otherVector.x, this.y + otherVector.y);
	}

	subtract (otherVector) {
		return new Vector(this.x - otherVector.x, this.y - otherVector.y);
	}

	magnitude () {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	normalize () {
		const magnitude = this.magnitude();
		return new Vector(this.x / magnitude, this.y / magnitude);
	}

	scale (ammount) {
		return new Vector(this.x * ammount, this.y * ammount);
	}

	rotate (degrees) {
		const radians = degrees * Math.PI / 180;
		const sin = Math.sin(radians);
		const cos = Math.cos(radians);

		return new Vector(
			this.x * cos - this.y * sin,
			this.x * sin + this.y * cos,
		);
	}
}