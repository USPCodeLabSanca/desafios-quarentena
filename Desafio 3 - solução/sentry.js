const SENTRY_SIZE = 30;

const SENTRY_FIRE_RATE = 40 // frames between shots
const SENTRY_ROTATION_SPEED = Math.PI / 180 / 2; // angle / frame

class Sentry extends MovableEntity {
	static instance = null;

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
		super(containerElement, SENTRY_SIZE, initialPosition, undefined, direction);

		this.mapInstance = mapInstance;

		mapInstance.addEntity(this);
		this.rootElement.classList.add('sentry');

		this.shotCooldown = 0;

		this.sentryBody = document.createElement('img');
		this.sentryBody.src = 'assets/sentry-body.svg';
		this.sentryHead = new MovableEntity(containerElement, SENTRY_SIZE, initialPosition, undefined, direction);
		this.sentryHead.rootElement.style.backgroundImage = "url('assets/sentry-head.svg')";
		this.sentryHead.rootElement.style.backgroundSize = this.size + 'px';
		this.sentryHead.rootElement.style.backgroundPosition = 'center';
		this.sentryHead.rootElement.style.backgroundRepeat = 'no-repeat';

		this.rootElement.appendChild(this.sentryBody);
		if (Sentry.instance) Sentry.instance.delete();
		Sentry.instance = this;
	}

	delete () {
		super.delete();
		this.sentryHead.delete();
		Sentry.instance = null;
	}

	collided (object) {
		if (object instanceof Alien || object instanceof Facehugger) {
			this.mapInstance.removeEntity(this);
			this.delete();
		}
	}

	shoot () {
		if (this.shotCooldown > 0) return this.shotCooldown --;
		this.shotCooldown = SENTRY_FIRE_RATE;
		new Bullet(this.containerElement, this.mapInstance, this.position, this.sentryHead.direction);
	}

	/**
	* @argument { Vector } target The entity to face
	* @returns { boolean } Wether the sentry could face the target or not
	*/
	faceTarget (target) {
		const targetDirection = target.position.subtract(this.position);
		const headDirection = this.sentryHead.direction;
		const angle = headDirection.angleBetween(targetDirection);
		if (angle > SENTRY_ROTATION_SPEED) {
			if (headDirection.isClockwise(targetDirection)) {
				this.sentryHead.setDirection(headDirection.rotate(SENTRY_ROTATION_SPEED));
			} else {
				this.sentryHead.setDirection(headDirection.rotate(-SENTRY_ROTATION_SPEED));
			}
			return false;
		} else {
			this.sentryHead.setDirection(targetDirection);
			return true;
		}
	}

	frame () {
		super.frame();

		const target = Map.instance.movableEntities.find(entity => entity instanceof Alien || entity instanceof Facehugger);
		if (!target) return;
		if (this.faceTarget(target)) this.shoot();
	}
}