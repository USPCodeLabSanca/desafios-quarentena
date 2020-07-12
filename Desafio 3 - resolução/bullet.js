let BULLET_SIZE = 10;
let BULLET_SPEED = 4;
let REFLECT = true;
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
	* @argument { Vector } initialPosition Where the bullet is spawn in map
	* @argument { Vector } direction The bullet's direction
	*/
	constructor (
		containerElement,
		mapInstance,
		initialPosition,
		direction
	) {
		//direction = new Vector(-0.1, -0.1);
		// The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		super(containerElement, BULLET_SIZE, initialPosition, direction.normalize().scale(BULLET_SPEED), direction);

		this.mapInstance = mapInstance;

		// This is so the map can execute the player's physics (see the `frame` function
		// in the `map.js` file
		mapInstance.addEntity(this);

		// Assigns the bullet's image to it's element
		this.rootElement.style.backgroundImage = "url('assets/bullet_invert.svg')";
		this.rootElement.style.backgroundSize = this.size + 'px';
	}

	// Custom shoots
	static bonusLazyBall() {
		BULLET_SPEED = 0.02;
		BULLET_SIZE = 10;
	}

	static bonusFastBall() {
		BULLET_SPEED = 9;
		BULLET_SIZE = 20;
	}

	static bonusBigBall() {
		BULLET_SPEED = 9;
		BULLET_SIZE = 40;
	}

	static defaultBall() {
		BULLET_SPEED = 4;
		BULLET_SIZE = 10;
	}

	// Apply an config of ball by 5 seconds
	static applyBonus(bonus) {
		switch(bonus) {
			case 1:
				Bullet.bonusBigBall();
				REFLECT = true;
				break;
			case 2:
				Bullet.bonusFastBall();
				REFLECT = true;
			break;
			case 3:
				Bullet.bonusLazyBall();
				REFLECT = false;
			break;
			default:
				Bullet.defaultBall();
				REFLECT = false;
			break;
		}

		// effect of ball
		setTimeout(() => {
			Bullet.defaultBall();
			REFLECT = false;
		}, 5000);
	}

	// If the bullet collides with an asteroid, delete the bullet.
	collided (object) {
		if(object instanceof Player || object instanceof Bullet) return;
		this.mapInstance.removeEntity(this);
		this.delete();
	}
	
}