class MovableEntity {
	constructor (
		containerElement,
		size = 10,
		initialPosition = new Vector(0, 0),
		initialVelocity = new Vector(0, 0),
		direction = new Vector(1, 0), // facing right
	) {
		this.size = size;
		this.position = initialPosition;
		this.velocity = initialVelocity;
		this.direction = direction;

		this.rootElement = document.createElement('div');
		this.rootElement.classList.add('movable-entity');
		this.rootElement.style.width = size + 'px';
		this.rootElement.style.height = size + 'px';
		this.rootElement.style.left = this.position.x + 'px';
		this.rootElement.style.top = this.position.y + 'px';

		this.setDirection(this.direction);

		containerElement.appendChild(this.rootElement);
	}

	collided (objectThatCollided) {
		// Function to override
	}

	distanceFromCenter () {
		return this.position.magnitude();
	}

	delete () {
		this.rootElement.remove();
	}

	setDirection (newDirection) {
		this.direction = newDirection.normalize();
		let angle = Math.atan(this.direction.y / this.direction.x) + Math.PI;
		if (this.direction.x < 0) angle -= Math.PI;
		this.rootElement.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;
	}

	frame () {
		this.position = this.position.add(this.velocity);
		this.rootElement.style.left = this.position.x + 'px';
		this.rootElement.style.top = this.position.y + 'px';
	}

	static didEntitiesColide (entity1, entity2) {
		const difference = entity1.position.subtract(entity2.position);
		const distance = difference.magnitude();

		if (distance <= (entity1.size + entity2.size) / 2) return true;
		else return false;
	}
}