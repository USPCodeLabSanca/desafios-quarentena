const MIN_ASTEROID_SIZE = 30;
const MAX_ASTEROID_SIZE = 80;

const MIN_ASTEROID_LIFE = 1;
const MAX_ASTEROID_LIFE = 3;

const MAX_ASTEROID_ROTATION_SPEED = 2;

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
		const size = Asteroid.getRandomSize();
		const direction = Asteroid.getRandomDirection();
		const velocity = (-5.0/(size*size));

		const colors = ['yellow', 'red', 'blue', 'red',  'blue'];

		// The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		super(containerElement, size, initialPosition, initialPosition.scale(velocity), direction);

		this.mapInstance = mapInstance;
		this.rotationSpeed = Asteroid.getRandomRotationSpeed();

		// This is so the map can execute the player's physics (see the `frame` function
		// in the `map.js` file
		mapInstance.addEntity(this);

		// initializes the asteroid's life to it's maximum.
		this.life = this.calculateMaxLife();

		// Finds a random image to assign to the asteroid's element
		const asteroidImageIndex = Math.floor(Math.random() * 5) + 1;
		this.rootElement.style.backgroundImage = `url('assets/asteroid-${asteroidImageIndex}_invert.svg')`;
		this.rootElement.style.backgroundSize = size + 'px';
		this.rootElement.classList.add(colors[asteroidImageIndex-1]);
	}

	/**
	* Creates a random size for an asteroid
	*
	* Also, this is a static method, which means it does not belong to an object, but to the class itself.
	* if you'd like to know more abou static methods, see this link:
	* https://medium.com/@yyang0903/static-objects-static-methods-in-es6-1c026dbb8bb1
	* @returns { number }
	*/
	static getRandomSize () {
		return Math.floor(Math.random() * (MAX_ASTEROID_SIZE - MIN_ASTEROID_SIZE) + MIN_ASTEROID_SIZE);
	}

	/**
	* Creates a random direction for an asteroid
	* @returns { Vector }
	*/
	static getRandomDirection () {
		return new Vector(Math.random(), Math.random());
	}

	/**
	* Creates a random rotation speed to an asteroid
	* @returns { number }
	*/
	static getRandomRotationSpeed () {
		return (Math.random() - 0.5) * 2 * MAX_ASTEROID_ROTATION_SPEED;
	}

	/**
	* Calculates the max life of the asteroid based on it's size. The larger the asteroid,
	* the larger it's life.
	* @returns { number }
	*/
	calculateMaxLife () {
		const sizePercentage = (this.size - MIN_ASTEROID_SIZE) / (MAX_ASTEROID_SIZE - MIN_ASTEROID_SIZE);
		return Math.round(sizePercentage * (MAX_ASTEROID_LIFE - MIN_ASTEROID_LIFE) + MIN_ASTEROID_LIFE);
	}

	/**
	 * @param {string} image url of an immage 
	 * @param {number} size size of render image in px 
	 * @param {string} className the class the image will assume
	 * 
	 * Use this function to update rooElement in the game
	 */
	setElement(image, size, className) {
		this.rootElement.style.backgroundImage = image;
		this.rootElement.style.backgroundSize = size + 'px';
		this.rootElement.style.width = size + 'px';
		this.rootElement.style.heigth = size + 'px';

		if(className === '') {
			this.rootElement.classList.remove(...['yellow', 'blue', 'red']);
		} else {
			this.rootElement.classList.add(className);
		}
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
		
		this.life--;
		
		// If objcted collided with bullet, show gif explosion
		if (this.life <= 0) {
			this.setElement(`url('assets/explosion.gif')`, this.size * 3, '');
			let flag = (this.size > MAX_ASTEROID_SIZE / 2)? true : false;
			this.size = 0;
			//setTimeout(() => {
				// If was a big asteroid, then release anothe one with half of max size and one life.
				// spawn asteroid
				// Desafio 3 - Bonus 2
				if(flag) {
					this.life = 1;
					this.size = MAX_ASTEROID_SIZE / 3;
					this.setElement(`url('assets/asteroid-4_invert.svg')`, this.size, 'red');
				} else {
			 		this.mapInstance.removeEntity(this);
					this.delete();
				}
			//}, 100);
		}
	}

	/*
	* This function should be called every game frame. It will not only update the
	* asteroid's physics, but also rotate it based on it's rotation speed.
	*/
	frame () {
		// If the asteroids is without life, dn't move it.
		if (this.life > 0) {
			super.frame();
			this.setDirection(this.direction.rotate(this.rotationSpeed))
		}
	}
}
