const PLAYER_SIZE = 20;

class Player extends MovableEntity {
	constructor (
		containerElement,
		mapInstance,
		gameOverFunction,
	) {
		super(containerElement, PLAYER_SIZE);
		this.mapInstance = mapInstance;
		this.containerElement = containerElement;
		this.gameOverFunction = gameOverFunction;
		mapInstance.addEntity(this);

		this.rootElement.style.backgroundImage = "url('assets/player.svg')";
		this.rootElement.style.backgroundSize = this.size + 'px';
	}

	turn (degrees) {
		this.setDirection(this.direction.rotate(degrees));
	}

	shoot () {
		new Bullet (this.containerElement, this.mapInstance, this.direction);
	}

	collided () {
		this.gameOverFunction();
	}
}