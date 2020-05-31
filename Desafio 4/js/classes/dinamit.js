const MAX_DINAMIT_SIZE = 50;
const MIN_DINAMIT_SIZE = 20;

const MIN_DINAMIT_SCORE = 1;
const MAX_DINAMIT_SCORE = 3;

const MIN_DINAMIT_SPEED_MULTIPLIER = 2.0;
const MAX_DINAMIT_SPEED_MULTIPLIER = 2.7;

/**
* This is a class declaration
* This class is responsible for defining the DINAMIT behavior
* Dinamits are used to drop the current hooked objetc when pressed key 'e'.
*
* This class extends the Entity class, which is responsible for binding the element's
* positons and directions. If you'd like to know more about class inheritance in javascript, see this link
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
*/
class Dinamit extends Entity {
	/**
	* Store all existing isntances of rocks, for easier tracking
	* @type { Dinamit[] }
	*/
	static allDinamitElements = [];

	/**
	* @argument { HTMLDivElement } containerElement The HTML element in which the DINAMIT should be created.
	* @argument { Vector } initialPosition The initial position of the DINAMIT
	*/
	constructor (
		containerElement,
		initialPosition,
	) {
		const size = Math.random() * (MAX_DINAMIT_SIZE - MIN_DINAMIT_SIZE) + MIN_DINAMIT_SIZE; // size of dinamit
		const direction = Vector.random;

		// The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		super(containerElement, new Vector(1, 1).scale(size), initialPosition, direction);

		// Assigns the hook's image to it's element
		this.rootElement.style.backgroundImage = "url('assets/dinamit.png')";

		// Add element to rocks list, for easier tracking.
		Dinamit.allDinamitElements.push(this);
	}


	/**
	* When this object is hooked, it should slow the hook down. This function will
	* tell the hook how much should it slow down.
	* @returns { number } A speed multiplier
	*/
	calculateHookSpeedMultiplier () {
		const size = Math.max(this.size.x, this.size.y);
		const sizePercentage = (size - MIN_DINAMIT_SIZE) / (MAX_DINAMIT_SIZE - MIN_DINAMIT_SIZE);
		const speedMultiplier = sizePercentage * (MAX_DINAMIT_SPEED_MULTIPLIER - MIN_DINAMIT_SPEED_MULTIPLIER) + MIN_DINAMIT_SPEED_MULTIPLIER;
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
		const index = Dinamit.allDinamitElements.findIndex(e => e === this);
		if (index !== -1) Dinamit.allDinamitElements.splice(index, 1);
	}
}