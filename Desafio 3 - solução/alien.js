const ALIEN_SIZE = 40;
const ALIEN_LIFE = 2;
const ALIEN_WALKING_SPEED = 0.5;

/**
* This is a class declaration
* This class is responsible for defining the Aliens's behavior.
* this class extends the MovableEntity class, which is responsible for defining physics behavior
* If you'd like to know more about class inheritance in javascript, see this link
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
*/
class Alien extends MovableEntity {
	constructor (
		containerElement,
		mapInstance,
		initialPosition
	) {
		// The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		super(containerElement, ALIEN_SIZE, initialPosition);

		this.mapInstance = mapInstance;

		// This is so the map can execute the player's physics (see the `frame` function
		// in the `map.js` file
		mapInstance.addEntity(this);

		// initializes the alien's life to it's maximum.
		this.life = ALIEN_LIFE;

		// Finds a random image to assign to the alien's element
		this.rootElement.style.backgroundImage = `url('assets/walking-alien.gif')`;
		this.rootElement.style.backgroundSize = ALIEN_SIZE + 'px';
	}

	/**
	* Uppon collision with a bullet, reduces the alien's life. If the alien
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

	lookAtPlayer () {
		const diff = Player.instance.position.subtract(this.position);
		this.setDirection(diff.rotate(90));
	}

	moveTowardsPlayer () {
		const diff = Player.instance.position.subtract(this.position).normalize().scale(ALIEN_WALKING_SPEED);
		this.position = this.position.add(diff);
	}

	frame () {
		this.moveTowardsPlayer();
		this.lookAtPlayer();
		super.frame();
	}
}