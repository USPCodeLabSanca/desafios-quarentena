const SentryCooldownTextElement = document.getElementById('sentry-cooldown-text');
const ScoreTextElement = document.getElementById('score-text');
const PLAYER_SIZE = 30;
const WALKING_ANIMATION_FRAME_COUNT = 8;
const TIME_BETWEEN_FRAMES = 100;
const SENTRY_COOLDOWN = 60 * 1000; // 60 seconds

/**
* This is a class declaration
* This class is responsible for defining the player behavior
* There should be only one player in the game, so this is a Singleton class.
* If you'd like to know more about the singleton pattern, see this link:
* https://en.wikipedia.org/wiki/Singleton_pattern
*
* this class extends the MovableEntity class, which is responsible for defining physics behavior
* If you'd like to know more about class inheritance in javascript, see this link
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
*/
class Player extends MovableEntity {
	/**
	* @type { Player }
	*/
	static instance = null;

	/**
	* @argument { HTMLDivElement } containerElement The HTML element in which the player
	* should be created. This will allow us to have more control over the player's styles
	* @argument { Map } mapInstance A reference to the game's map. It will be used
	* to instantiate Bullet objects (see the `shoot` function below).
	* @argument { Function } gameOverFunction A function to be called in case the
	* player is hit by an alien (so, gameover).
	*/
	constructor (
		containerElement,
		mapInstance,
		gameOverFunction,
	) {

		// The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		super(containerElement, PLAYER_SIZE);

		this.mapInstance = mapInstance;
		this.containerElement = containerElement;
		this.gameOverFunction = gameOverFunction;
		this.lastMousePosition = new Vector(0, -1);
		this.currentWalkingAnimationFrame = 0;
		this.lastFrameSwitchTimestamp = 0;

		// This is so the map can execute the player's physics (see the `frame` function
		// in the `map.js` file
		mapInstance.addEntity(this);

		this.rootElement.classList.add('player');
		this.rootElement.style.zIndex = '1';

		// Creates all of the player's walking frames.
		for (let i = 0; i < WALKING_ANIMATION_FRAME_COUNT; i ++) {
			const imageElement = document.createElement('img');
			imageElement.src = `./assets/player-${i}.png`;
			imageElement.style.display = 'none';
			imageElement.id = 'frame-' + i.toString();
			this.rootElement.appendChild(imageElement);
		}

		this.setWalkingAnimationframe(0);

		this.score = 0;
		this.lastSentryDeploy = 0;

		Player.instance = this;
	}

	set score (newScore) {
		this._score = newScore;
		ScoreTextElement.innerText = this.score;
	}

	get score () {
		return this._score;
	}

	/**
	* Will rotate the player's model
	* @argument { number } degrees
	*/
	turn (degrees) {
		this.setDirection(this.direction.rotate(degrees));
	}

	/**
	* Instantiates a bullet in front of the player.
	*/
	shoot () {
		new Bullet (this.containerElement, this.mapInstance, this.position, this.direction);
	}

	/**
	* This is only called if the player collides with an alien. Therefore,
	* the game should end.
	* @argument { MovableEntity } object
	*/
	collided (object) {
		if (object instanceof Alien || object instanceof Facehugger) this.gameOverFunction();
	}

	/**
	* Function to update the last position of the mouse
	* @argument { Vector } mousePosition
	*/
	updateMousePosition (mousePosition) {
		this.lastMousePosition = mousePosition;
		this.lookAtMouse();
	}

	/**
	* Will make the player face at the last position the mouse was recorded to be
	*/
	lookAtMouse () {
		const diff = this.lastMousePosition.subtract(this.position);
		this.setDirection(diff);
	}

	/**
	* Will set the current shown frame to be the frameIndex.
	* @argument { number } frameIndex
	*/
	setWalkingAnimationframe (frameIndex) {
		// Hides current frame
		this.rootElement.querySelector('#frame-' + this.currentWalkingAnimationFrame).style.display = 'none';
		this.currentWalkingAnimationFrame = frameIndex % WALKING_ANIMATION_FRAME_COUNT;
		// Shows next frame
		this.rootElement.querySelector('#frame-' + this.currentWalkingAnimationFrame).style.display = '';
	}

	/**
	* Will move the player by offset
	* @argument { Vector } offset
	*/
	move (offset) {
		this.position = this.position.add(offset.normalize().scale(0.2));

		// Prevents the player to walk too far away from the map
		// Walking too far would activa the deletion mechanism in the map's frame,
		// and that would be bad
		if (this.distanceFromCenter() > 290) {
			this.position = this.position.normalize().scale(290);
		}

		// Since the position changed, we have to update the player's rotation to
		// face the mouse again
		this.lookAtMouse();

		// Now, handling the moving animation...

		// Show next animation frame if it's been too long on the current frame.
		if (Date.now() - this.lastFrameSwitchTimestamp > TIME_BETWEEN_FRAMES) {
			this.setWalkingAnimationframe(this.currentWalkingAnimationFrame + 1);
			this.lastFrameSwitchTimestamp = Date.now();
		}

		// This is to reset the player's animation if they stand for too long.
		clearTimeout(this.walkingAnimationHandler);
		this.walkingAnimationHandler = setTimeout(() => {
			this.setWalkingAnimationframe(0);
		}, 500);
	}

	frame () {
		super.frame();
		const timeRemaining = Math.floor((Date.now() - this.lastSentryDeploy));
		if (timeRemaining <= SENTRY_COOLDOWN) {
			SentryCooldownTextElement.innerText = Math.floor((SENTRY_COOLDOWN - timeRemaining) / 1000);
		} else {
			SentryCooldownTextElement.innerText = `Aperte 'e' para usar`;
		}
	}

	deploySentry () {
		if (Date.now() - this.lastSentryDeploy < SENTRY_COOLDOWN) return;
		this.lastSentryDeploy = Date.now();
		new Sentry(this.containerElement, this.mapInstance, this.position, this.direction);
	}
}