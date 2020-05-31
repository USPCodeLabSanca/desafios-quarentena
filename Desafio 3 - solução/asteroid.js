const ASTEROID_SIZE = 40;

const MIN_ASTEROID_LIFE = 1;
const MAX_ASTEROID_LIFE = 3;

const MAX_ASTEROID_ROTATION_SPEED = 1;

/**
* This is a class declaration
* This class is responsible for defining the Asteroids's behavior.
* this class extends the MovableEntity class, which is responsible for defining physics behavior
* If you'd like to know more about class inheritance in javascript, see this link
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
*/
class Asteroid extends MovableEntity {
	constructor (
		containerElement,
		mapInstance,
		initialPosition
	) {
		// The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		super(containerElement, ASTEROID_SIZE, initialPosition, initialPosition.scale(-0.001), initialPosition.rotate(-90));

		this.mapInstance = mapInstance;

		// This is so the map can execute the player's physics (see the `frame` function
		// in the `map.js` file
		mapInstance.addEntity(this);

		// initializes the asteroid's life to it's maximum.
		this.life = 2;

		// Finds a random image to assign to the asteroid's element
		this.rootElement.style.backgroundImage = `url('assets/walking-alien.gif')`;
		this.rootElement.style.backgroundSize = ASTEROID_SIZE + 'px';
	}

	/**
	* Uppon collision with a bullet, reduces the asteroid's life. If the asteroid
	* has zero life, destroy it.
	* @argument { MovableObject } object
	*/
	collided (object) {
		// the instanceof operator will check if an object was created by a class, or one of it's children.
		// If you'd like to know more about the instanceof operator, see this link:
		// https://www.geeksforgeeks.org/instanceof-operator-in-javascript/
		if (!(object instanceof Bullet)) return;

		this.life --;
		if (this.life === 0) {
			this.mapInstance.removeEntity(this);
			this.rootElement.style.backgroundImage = `url('assets/dying-alien.gif')`;
			setTimeout(() => {
				this.delete();
			}, 1000);

			Player.instance.score++;
		}
	}
}