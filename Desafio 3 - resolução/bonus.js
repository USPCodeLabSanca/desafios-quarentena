// Desafio 3 - Bonus 3
// This is a bonus a player can take to mdify bullets
const BONUS_SIZE = 25;

/**
* This is a class declaration
* This class is responsible for defining th bonuss's behavior.
* this class extends the MovableEntity class, which is responsible for defining physics behavior
* If you'd like to know more about class inheritance in javascript, see this link
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
*/
class Bonus extends MovableEntity {
	constructor (
		containerElement,
		mapInstance,
		initialPosition
	) {
		const direction = Bonus.getRandomDirection();

		// The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		super(containerElement, BONUS_SIZE, initialPosition, initialPosition.scale(-0.003), direction);

		this.mapInstance = mapInstance;
		this.rotationSpeed = 1;

		// This is so the map can execute the player's physics (see the `frame` function
		// in the `map.js` file
		mapInstance.addEntity(this);

		// Finds a random image to assign to the bonus's element
		this.rootElement.style.backgroundImage = `url('assets/bonus_1.png')`;
		this.rootElement.style.backgroundSize = BONUS_SIZE + 'px';
		this.rootElement.style.zIndex = 1;
		this.rootElement.classList.add('shine');
	}
	

	/**
	* Creates a random direction for a bonus
	* @returns { Vector }
	*/
	static getRandomDirection () {
		return new Vector(Math.random(), Math.random());
	}

	/**
	* Creates a random with type bonus
	* @returns { Vector }
	*/
	getRandomBonus () {
		return Math.floor(Math.random() * 3) + 1;
	}	
	
	/**
	 * Uppon collision with a bullet, apply bonus to player. Then destroy it.
	 * @argument { MovableObject } object
	 */
	collided (object) {
		// the instanceof operator will check if an object was created by a class, or one of it's children.
		// If you'd like to know more about the instanceof operator, see this link:
		// https://www.geeksforgeeks.org/instanceof-operator-in-javascript/
		if(object instanceof Player) {
			Bullet.applyBonus(this.getRandomBonus());
			this.mapInstance.removeEntity(this);
			this.delete();
		}	
	}

	/*
	* This function should be called every game frame. It will not only update the
	 bonus's physics, but also rotate it based on it's rotation speed.
	*/
	frame () {
		// If th bonuss is without life, dn't move it.
		super.frame();
		this.setDirection(this.direction.rotate(this.rotationSpeed))
	}
}