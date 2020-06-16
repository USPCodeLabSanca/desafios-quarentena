/**
* This is a class declaration
* This class is supposed to be abstract. If you'd like to know more about abstract
* classes, see this link:
* https://hackernoon.com/abstract-classes-and-oop-extras-d087eeb1aca9
*
* This class extends the Entity class, which is responsible for defining binding the element's
* positons and directions. If you'd like to know more about class inheritance in javascript, see this link
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
*
* This class is responsible for defining the game's moving physics behavior. A
* movable entity is anything that may have a velocity (and therefore moves across the world).
* A movable entity also must have a frame function to constantly update it's position.
*/
class MovableEntity extends Entity{
	/**
	* This array will contain all movable entities to make it easier to track and
	* update their physics
	* @type { MovableEntity[] }
	*/
	static existingMovableEntities = [];

	/**
	* @argument { HTMLDivElement } containerElement
	* @argument { Vector } size
	* @argument { Vector } initialPosition
	* @argument { Vector } initialVelocity
	* @argument { Vector } direction
	*/
	constructor (
		containerElement,
		size,
		initialPosition,
		initialVelocity = Vector.zero,
		direction,
	) {

		// The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		super(containerElement, size, initialPosition, direction);

		this.velocity = initialVelocity;
		// Add object to movable entities list.
		MovableEntity.existingMovableEntities.push(this);
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
		const index = MovableEntity.existingMovableEntities.findIndex(e => e === this);
		MovableEntity.existingMovableEntities.splice(index, 1);
	}

	/**
	* Will rotate the object's model
	* @argument { number } degrees
	*/
	turn (degrees) {
		this.direction = this.direction.rotate(degrees);
	}

	/**
	* This function should be called every game frame to update the object's position
	* according to it's velocity.
	*/
	frame () {
		this.position = this.position.add(this.velocity);
	}

	/**
	* Here, we run all frame functions of all objetcs to uptade their physicsion#Circle_Collision
	*
	* Also, this is a static method, which means it does not belong to an object, but to the class itself.
	* if you'd like to know more about static methods, see this link:
	* https://medium.com/@yyang0903/static-objects-static-methods-in-es6-1c026dbb8bb1
	*/
	static runAllFrameFunctions () {
		MovableEntity.existingMovableEntities.forEach(entity => entity.frame());
	}
}