/**
* This is a class declaration.
* Class to make vector operations easier
*/
class Vector {

	/**
	* @argument { number } x the X coordinate
	* @argument { number } y the Y coordinate
	*/
	constructor (x, y) {
		this.x = x;
		this.y = y;
	}

	/**
	* Adds two this vector with otherVector
	* @argument { Vector } otherVector
	* @returns { Vector }
	*/
	add (otherVector) {
		return new Vector(this.x + otherVector.x, this.y + otherVector.y);
	}

	/**
	* Subtracts two this vector with otherVector
	* @argument { Vector } otherVector
	* @returns { Vector }
	*/
	subtract (otherVector) {
		return new Vector(this.x - otherVector.x, this.y - otherVector.y);
	}

	/**
	* Returns the magnitude of the vector.
	* The magnitude of a vector is the vector's intensity (how big/strong the vector is).
	* @returns { number }
	*/
	magnitude () {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	/**
	* Returns a normalized version of this vector.
	* A normalized vector is a vector with a magnitude value of 1, but with the same
	* direction of the original vector. If you'd like to know more about vector normalization,
	* see the link: https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-vectors/a/vector-magnitude-normalization
	* @returns { Vector }
	*/
	normalize () {
		const magnitude = this.magnitude();
		return new Vector(this.x / magnitude, this.y / magnitude);
	}

	/**
	* Scales this vector.
	* A scaled vector is the original vector with 'ammount' times it's magnitude.
	* @argument { number } ammount
	* @returns { Vector }
	*/
	scale (ammount) {
		return new Vector(this.x * ammount, this.y * ammount);
	}

	/** Returns a rotated version of this vector
	* If you'd like to know more about rotating 2D vectors, see this link:
	* https://matthew-brett.github.io/teaching/rotation_2d.html
	* @argument { number } degrees
	* @returns { Vector }
	*/
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