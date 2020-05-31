const BULLET_SIZE = 20;
const BULLET_SPEED = 5;

/**
* This is a class declaration
* This class is responsible for defining the bullets behavior.
* this class extends the MovableEntity class, which is responsible for defining physics behavior
* If you'd like to know more about class inheritance in javascript, see this link
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
*/
class Bullet extends MovableEntity {

	/**
	* @argument { HTMLDivElement } containerElement The DOM element that will contain the bullet
	* @argument { Map } mapInstance The map in which the bullet will spawn
	* @argument { Vector } initialPosition The bullet's initial position
	* @argument { Vector } direction The bullet's direction
	*/
	constructor (
		containerElement,
		mapInstance,
		initialPosition,
		direction
	) {
		// The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		super(containerElement, BULLET_SIZE, initialPosition, direction.normalize().scale(BULLET_SPEED), direction);

		this.mapInstance = mapInstance;

		// This is so the map can execute the player's physics (see the `frame` function
		// in the `map.js` file
		mapInstance.addEntity(this);

		// Assigns the bullet's image to it's element
		this.rootElement.style.backgroundImage = "url('assets/bullet.svg')";
		this.rootElement.style.backgroundSize = this.size + 'px';
	}

	// If the bullet collides with an alien, delete the bullet.
	collided (object) {
		if (object instanceof Alien || object instanceof Facehugger) {
			this.mapInstance.removeEntity(this);
			this.delete();
		}
	}
}