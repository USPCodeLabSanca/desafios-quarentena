const MAX_ROCK_SIZE = 50;
const MIN_ROCK_SIZE = 20;

const MIN_ROCK_SPEED_MULTIPLIER = 0.7;
const MAX_ROCK_SPEED_MULTIPLIER = 0.2;

/**
* This is a class declaration
* This class is responsible for defining the rock behavior
*
* This class extends the Entity class, which is responsible for binding the element's
* positons and directions. If you'd like to know more about class inheritance in javascript, see this link
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
*/
class Rock extends Entity {
	/**
	* Store all existing isntances of rocks, for easier tracking
	* @type { Rock[] }
	*/
	static allRockElements = [];

	/**
	* @argument { HTMLDivElement } containerElement The HTML element in which the rock should be created
	* @argument { Vector } initialPosition The initial position of the rock
	*/
	constructor (
		containerElement,
		initialPosition,
	) {
		const size = Math.random() * (MAX_ROCK_SIZE - MIN_ROCK_SIZE) + MIN_ROCK_SIZE;
		const direction = Vector.random;

		// The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		super(containerElement, new Vector(1, 1).scale(size), initialPosition, direction);

		// Assigns the hook's image to it's element
		this.rootElement.style.backgroundImage = "url('assets/rock.svg')";

		// Add element to rocks list, for easier tracking.
		Rock.allRockElements.push(this);
	}

	/**
	* When this object is hooked, it should slow the hook down. This function will
	* tell the hook how much should it slow down.
	* @returns { number } A speed multiplier
	*/
	calculateHookSpeedMultiplier () {
		const size = Math.max(this.size.x, this.size.y);
		const sizePercentage = (size - MIN_ROCK_SIZE) / (MAX_ROCK_SIZE - MIN_ROCK_SIZE);
		const speedMultiplier = sizePercentage * (MAX_ROCK_SPEED_MULTIPLIER - MIN_ROCK_SPEED_MULTIPLIER) + MIN_ROCK_SPEED_MULTIPLIER;
		return speedMultiplier;
	}

	/**
	* This method removes the Entity's element from the DOM, and the entities list
	* Note that this methods overrides the parent class's delete method. This is to
	* allow for behavior extension.
	*/
	delete () {
		// This is to call the parent class's delete method
		super.delete();

		// Here, we will find the index of the entity, and use it to remove the element from the
		// movableEntities array.
		// If you don't know how the splice method works, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
		// If you dont't know how the findIndex method works, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
		const index = Rock.allRockElements.findIndex(e => e === this);
		if (index !== -1) Rock.allRockElements.splice(index, 1);
	}
}