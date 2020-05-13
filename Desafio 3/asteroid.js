const MIN_ASTEROID_SIZE = 20;
const MAX_ASTEROID_SIZE = 50;

const MIN_ASTEROID_LIFE = 1;
const MAX_ASTEROID_LIFE = 3;

const MAX_ASTEROID_ROTATION_SPEED = 1;

class Asteroid extends MovableEntity {
	constructor (
		containerElement,
		mapInstance,
		initialPosition
	) {
		const size = Asteroid.getRandomSize();
		const direction = Asteroid.getRandomDirection();
		super(containerElement, size, initialPosition, initialPosition.scale(-0.001), direction);
		this.mapInstance = mapInstance;
		this.rotationSpeed = Asteroid.getRandomRotationSpeed();
		mapInstance.addEntity(this);
		this.life = this.calculateMaxLife();

		const asteroidImageIndex = Math.floor(Math.random() * 3) + 1;
		this.rootElement.style.backgroundImage = `url('assets/asteroid-${asteroidImageIndex}.svg')`;
		this.rootElement.style.backgroundSize = size + 'px';
	}

	static getRandomSize () {
		return Math.floor(Math.random() * (MAX_ASTEROID_SIZE - MIN_ASTEROID_SIZE) + MIN_ASTEROID_SIZE);
	}

	static getRandomDirection () {
		return new Vector(Math.random(), Math.random());
	}

	static getRandomRotationSpeed () {
		return (Math.random() - 0.5) * 2 * MAX_ASTEROID_ROTATION_SPEED;
	}

	calculateMaxLife () {
		const sizePercentage = (this.size - MIN_ASTEROID_SIZE) / (MAX_ASTEROID_SIZE - MIN_ASTEROID_SIZE);
		return Math.round(sizePercentage * (MAX_ASTEROID_LIFE - MIN_ASTEROID_LIFE) + MIN_ASTEROID_LIFE);
	}

	collided (object) {
		if (!(object instanceof Bullet)) return;
		this.life --;
		if (this.life === 0) {
			this.mapInstance.removeEntity(this);
			this.delete();
		}
	}

	frame () {
		super.frame();
		this.setDirection(this.direction.rotate(this.rotationSpeed));
	}
}