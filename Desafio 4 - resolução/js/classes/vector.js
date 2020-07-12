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

	/*
	* The following static getters will return constant vectors to help keeping
	* our coordinates system consistent
	*
	* Also, these are getter functions (because they have a 'get' before their names).
	* If you'd like to know more about getters, see this link
	* https://javascript.info/property-accessors
	*/
	static get zero () { return new Vector(0, 0); }
	static get up () { return new Vector(0, -1); }
	static get down () { return new Vector(0, 1); }
	static get left () { return new Vector(-1, 0); }
	static get right () { return new Vector(1, 0); }
	static get random () { return new Vector(2 * Math.random() - 1, 2 * Math.random() - 1); }

	/**
	* Will return a copy of this vector
	*/
	duplicate () {
		return new Vector(this.x, this.y);
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

	/**
	* Returns the dot product between the two vectors.
	* If you'd like to know more about dot products, see this link
	* https://www.mathsisfun.com/algebra/vectors-dot-product.html
	* @argument { Vector } vector
	* @returns { number }
	*/
	dotProduct (vector) {
		return this.x * vector.x + this.y * vector.y;
	}

	/**
	* Tells if the two vectors point in the same general direction.
	* If the angle between them is smaller than 90, will return true.
	* If the angle is larger than 90, will return false. This uses the fact that
	* cos(T) = (A dot B) / (|A| * |B|), where T is the angle between vector A and B.
	* If the cossine of T is less than 0, they point in different directions.
	* @argument { Vector } vector
	* @returns { boolean }
	*/
	isInSameDirectionOf (vector) {
		return this.dotProduct(vector) / (this.magnitude() * vector.magnitude()) > 0;
	}

	/** Returns a rotated version of this vector
	* If you'd like to know more about rotating 2D vectors, see this link:
	* https://matthew-brett.github.io/teaching/rotation_2d.html
	* @argument { number } angle
	* @returns { Vector }
	*/
	rotate (angle) {
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);

		return new Vector(
			this.x * cos - this.y * sin,
			this.x * sin + this.y * cos,
		);
	}
}