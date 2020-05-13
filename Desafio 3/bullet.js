const BULLET_SIZE = 10;
const BULLET_SPEED = 1;

class Bullet extends MovableEntity {
	constructor (
		containerElement,
		mapInstance,
		direction
	) {
		super(containerElement, BULLET_SIZE, undefined, direction.normalize().scale(BULLET_SPEED), direction);
		this.mapInstance = mapInstance;
		mapInstance.addEntity(this);

		this.rootElement.style.backgroundImage = "url('assets/bullet.svg')";
		this.rootElement.style.backgroundSize = this.size + 'px';
	}

	collided (object) {
		if (object instanceof Asteroid) {
			this.mapInstance.removeEntity(this);
			this.delete();
		}
	}
}