const FACEHUGGER_SIZE = 20;
const FACEHUGGER_LIFE = 2;
const FACEHUGGER_WALKING_SPEED = 0.2;
const FACEHUGGER_JUMPING_SPEED = 1.5;

class Facehugger extends MovableEntity {
	constructor (
		containerElement,
		mapInstance,
		initialPosition
	) {
		super(containerElement, FACEHUGGER_SIZE, initialPosition);

		this.mapInstance = mapInstance;

		mapInstance.addEntity(this);

		this.life = FACEHUGGER_LIFE;
		this.state = 'walking';
		this.jumpStartPosition = null; // holds the position the facehugger was when it started jumping

		this.rootElement.style.backgroundImage = `url('assets/walking-facehugger.gif')`;
		this.rootElement.style.backgroundSize = '50px';
		this.rootElement.style.backgroundPosition = 'center';
		this.rootElement.style.backgroundRepeat = 'no-repeat';
	}

	/**
	* Uppon collision with a bullet, reduces the facehugger's life. If the facehugger
	* has zero life, destroy it.
	* @argument { MovableObject } object
	*/
	collided (object) {
		// the instanceof operator will check if an object was created by a class, or one of it's children.
		// If you'd like to know more about the instanceof operator, see this link:
		// https://www.geeksforgeeks.org/instanceof-operator-in-javascript/
		if (!(object instanceof Bullet)) return;

		this.mapInstance.removeEntity(this);
		this.delete();

		Player.instance.score++;
	}

	lookAtPlayer () {
		const diff = Player.instance.position.subtract(this.position);
		this.setDirection(diff.rotate(90));
	}

	moveTowardsPlayer () {
		const speed = this.state === 'walking' ? FACEHUGGER_WALKING_SPEED : FACEHUGGER_JUMPING_SPEED;
		const diff = Player.instance.position.subtract(this.position).normalize().scale(speed);
		this.position = this.position.add(diff);
	}

	moveForward () {
		const speed = this.state === 'walking' ? FACEHUGGER_WALKING_SPEED : FACEHUGGER_JUMPING_SPEED;
		this.position = this.position.add(this.direction.scale(speed).rotate(-90));
	}

	distanceFromPlayer () {
		return Player.instance.position.subtract(this.position).magnitude();
	}

	jumpTowardsPlayer () {
		this.lookAtPlayer();
		this.jumpStartPosition = this.position;
		this.state = 'jumping';

		// Calcuates the velocity vector
		const speed = this.state === 'walking' ? FACEHUGGER_WALKING_SPEED : FACEHUGGER_JUMPING_SPEED;
		const diff = Player.instance.position.subtract(this.position).normalize().scale(speed);
		this.velocity = diff;
	}

	walkFrame () {
		this.moveTowardsPlayer();
		this.lookAtPlayer();

		if (this.distanceFromPlayer() <= 200) {
			this.state = 'waiting';
			setTimeout(() => this.jumpTowardsPlayer(), 1000);
		}
	}

	jumpFrame () {
		const diff = this.position.subtract(this.jumpStartPosition);
		if (diff.magnitude() >= 250) {
			this.state = 'waiting';
			this.velocity = new Vector(0, 0);
			setTimeout(() => {
				this.state = 'walking';
			}, 200);
		}
	}

	waitFrame () {
		this.lookAtPlayer();
	}

	frame () {
		if (this.state === 'walking') this.walkFrame();
		else if (this.state === 'waiting') this.waitFrame();
		else if (this.state === 'jumping') this.jumpFrame();
		super.frame();
	}
}