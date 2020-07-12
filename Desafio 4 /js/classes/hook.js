const HOOK_SIZE = new Vector(20, 20);
const THROW_SPEED = 0.5;
const BASE_HOOK_PULL_SPEED = 0.3;
const EMPTY_HOOK_SPEED = 2.0;
const CHAIN_SPACING = 7;
const CHAIN_SIZE = 10;

/**
* This is a class declaration
* This class is responsible for defining the hook behavior
* There should be only one hook in the game, so this is a Singleton class.
* If you'd like to know more about the singleton pattern, see this link:
* https://en.wikipedia.org/wiki/Singleton_pattern
*
* this class extends the MovableEntity class, which is responsible for defining physics behavior
* If you'd like to know more about class inheritance in javascript, see this link
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
*/
class Hook extends MovableEntity {
	/**
	* Will store the hook instance
	* @type { Hook }
	*/
	static hookElement = null;

	/**
	* @argument { HTMLDivElement } containerElement The HTML element in which the hook should be created
	* @argument { Vector } initialPosition
	* @argument { Function } onGoldDelivered A function to be called whenever gold is pulled back.
	*/
	constructor (
		containerElement,
		initialPosition,
		onGoldDelivered,
	) {
		// The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		super(containerElement, HOOK_SIZE, initialPosition);

		this.containerElement = containerElement;
		this.originPosition = this.position.duplicate();
		this.onGoldDelivered = onGoldDelivered;

		// Assigns the hook's image to it's element
		this.rootElement.style.backgroundImage = "url('assets/hook.svg')";

		/**
		* Tells what direction the hook is swinging. 1 is clockwise, -1 is counter-clockwise
		* @type { 1 | -1 }
		*/
		this.swingDirection = 1;

		/**
		* This is the state of the hook (whether it's being thrown, pulled or sinply swinging)
		* @type { 'swinging' | 'pulling' | 'throwing' }
		*/
		this.state = 'swinging';

		/**
		* This will hold the hooked object (gold of rock). If null, no object is currently being hooked
		* @type { Entity | null }
		*/
		this.hookedObject = null;

		/**
		* This will hold all chain link instances. The hook's chain is purely aesthetical.
		* @type { Entity[] }
		*/
		this.chains = [];

		Hook.hookElement = this;
	}

	/**
	* This function will tell if the hook should generate another chain link behind
	* it when it's being thrown.
	* @returns { boolean } Wether a chain link should be created or not.
	*/
	shouldGenerateAnotherChain () {
		if (this.chains.length === 0) return true;

		const lastGeneratedChain = this.chains[this.chains.length - 1];
		const distanceFromLastChain = this.position.subtract(lastGeneratedChain.position);
		if (distanceFromLastChain.magnitude() > CHAIN_SPACING) return true;
		return false;
	}

	/**
	* This function generates another chain link behind the hook while it's being thrown.
	*/
	generateChain () {
		const size = new Vector(CHAIN_SIZE, CHAIN_SIZE);
		const newChain = new Entity(this.containerElement, size, this.position);
		newChain.rootElement.style.border = '1px solid black';
		newChain.rootElement.style.borderRadius = '100%';
		this.chains.push(newChain);
	}

	/**
	* This function will tell if the hook should remove the chain link behind
	* it when it's being pulled.
	* @returns { boolean } Wether a chain link should be removed or not.
	*/
	shouldRemoveLastChain () {
		if (this.chains.length === 0) return false;

		const lastChain = this.chains[this.chains.length - 1];
		const distanceBetweenChainAndOrigin = this.originPosition.subtract(lastChain.position).magnitude();
		const distanceBetweenHookAndOrigin = this.position.subtract(this.originPosition).magnitude();
		if (distanceBetweenChainAndOrigin >= distanceBetweenHookAndOrigin) return true;
		return false;
	}

	/**
	* This function removes the last chain link behind the hook while it's being pulled.
	*/
	removeLastChain () {
		if (this.chains.length === 0) return;

		this.chains.pop().delete();
	}

	/**
	* This method removes the Hook's element from the DOM
	* Note that this methods overrides the parent class's delete method. This is to
	* allow for behavior extension.
	*/
	delete () {
		// This is to call the parent class's delete method
		super.delete();

		// Remove all remaining chain links
		while (this.chains.length > 0) this.removeLastChain();

		// Clear the class's hook instance.
		Hook.hookElement = null;
	}

	/**
	* Will start to throw the hook
	*/
	throw () {
		// Only swinging hooks can be thrown
		if (this.state !== 'swinging') return;

		// updates the hook state
		this.state = 'throwing';

		this.velocity = this.direction.scale(THROW_SPEED);
	}

	/**
	* Will start to pull the hook back
	*/
	pullBack () {
		// Only hooks that are being thrown can be pulled back.
		if (this.state !== 'throwing') return;

		// Updates the hook state.
		this.state = 'pulling';

		if (this.hookedObject) {
			// if an object was hooked, use it's speed multiplier
			const speed = BASE_HOOK_PULL_SPEED * this.hookedObject.calculateHookSpeedMultiplier();
			this.velocity = this.direction.scale(-speed);
		} else {
			// if no object was hooked, use the default value
			this.velocity = this.direction.scale(-EMPTY_HOOK_SPEED);
		}
	}

	/**
	* Will run a swing frame, calculating the next hook direction.
	*/
	swing () {
		this.turn(0.005 * this.swingDirection);
		const angle = this.angle;
		if (angle <= Math.PI / 2) {
			this.angle = Math.PI / 2;
			this.swingDirection *= -1;
		} else if (angle >= 1.5 * Math.PI) {
			this.angle = 1.5 * Math.PI;
			this.swingDirection *= -1;
		}
	}

	/**
	* Tells wether the hook was already pulled to it's maximum, and should start swinging again.
	* @returns { boolean } whether the hook should stop being pulled
	*/
	shouldStopPulling () {
		const diff = this.position.subtract(this.originPosition);
		return !diff.isInSameDirectionOf(this.direction);
	}

	/**
	* Stops the hook pulling state, and start the swinging one
	*/
	stopPulling () {
		this.position = this.originPosition;
		this.velocity = Vector.zero;
		this.state = 'swinging';

		// Remove all remaining chain links.
		while(this.chains.length > 0) this.removeLastChain();

		if (this.hookedObject) {
			if (this.hookedObject instanceof Gold) {
				// Gold was brought back! call the gold delivery callback.
				this.onGoldDelivered(this.hookedObject);
			}
			// removes forever the object that was pulled.
			this.hookedObject.delete();
			this.hookedObject = null;
		}
	}

	/**
	* This method is called whenever the hook colides with something.
	* Note that this methods overrides the parent class's collided method. This is to
	* allow for behavior extension.
	*/
	collided (object) {
		if (object instanceof Gold || object instanceof Rock) {
			this.hookedObject = object;
			this.hookedObject.offset = this.hookedObject.position.subtract(this.position);
			this.pullBack();
		}
	}

	/**
	* This method is called every frame.
	* Note that this methods overrides the parent class's frame method. This is to
	* allow for behavior extension.
	*/
	frame () {
		// This is to call the parent class's delete method
		super.frame();

		if (this.state === 'swinging') this.swing();
		else if (this.state === 'pulling' && this.shouldStopPulling()) this.stopPulling();
		else if (this.state === 'pulling' && this.shouldRemoveLastChain()) this.removeLastChain();
		else if (this.state === 'throwing' && this.shouldGenerateAnotherChain()) this.generateChain();

		if (this.hookedObject) {
			// Updates the hooked object's position to follow the hook at every frame.
			this.hookedObject.position = this.position.add(this.hookedObject.offset);
		}
	}
}