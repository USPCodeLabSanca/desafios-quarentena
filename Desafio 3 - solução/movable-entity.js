/**
* This is a class declaration
* This class is responsible for defining the game's physics behavior
*/
class MovableEntity {

	/**
	* @argument { HTMLDivElement } containerElement
	* @argument { number } size
	* @argument { Vector } initialPosition
	* @argument { Vector } initialVelocity
	* @argument { Vector } direction
	*/
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

		// Creates the element that will visually represent this MobableEntity
		this.rootElement = document.createElement('div');
		this.rootElement.classList.add('movable-entity');
		this.rootElement.style.width = size + 'px';
		this.rootElement.style.height = size + 'px';
		this.rootElement.style.left = this.position.x + 'px';
		this.rootElement.style.top = this.position.y + 'px';

		this.setDirection(this.direction);

		// Adds the element to the DOM.
		// If you'd like to know more about the DOM and it's manipulation, see the link:
		// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents#Moving_and_removing_elements
		containerElement.appendChild(this.rootElement);
	}

	/**
	* This method is currently empty becaus it should be overriden by MovableEntity's
	* children classes. If you'd like to know more about overriding a method, see this link
	* https://javascript.info/class-inheritance#overriding-a-method
	* @argument { MovableEntity } objectThatCollided The object that collided with
	* this.
	*/
	collided (objectThatCollided) {
		// Function to override
	}

	/**
	* Calculates the distance from this object's center to the map's center.
	* Note that the map's center is at coords (0, 0).
	* @returns { number } The distance to the center.
	*/
	distanceFromCenter () {
		return this.position.magnitude();
	}

	/**
	* This method removes the Entity's element from the DOM
	*/
	delete () {
		this.rootElement.remove();
	}

	/**
	* This method is to update the element's rotation along with it's direction.
	* @argument { Vector } newDirection
	*/
	setDirection (newDirection) {
		// Makes sure the new direction is normalized
		this.direction = newDirection.normalize();

		// Calculates the direction's vector angle with the X axis.
		// If you'd like to know more about this, see this link
		// https://chortle.ccsu.edu/VectorLessons/vch05/vch05_3.html
		let angle = Math.atan(this.direction.y / this.direction.x) + Math.PI;
		if (this.direction.x < 0) angle -= Math.PI;

		// The `translate(-50%, -50%)` part is just to keep the element's center
		// with the vector's representation. This is necessary because an element's top
		// and left position mark's the element's top-left corner, and not it's center.
		this.rootElement.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;
	}

	/**
	* This function should be called every game frame to update the object's position
	* according to it's velocity.
	*/
	frame () {
		this.position = this.position.add(this.velocity);

		// Updates the object element's position
		this.rootElement.style.left = this.position.x + 'px';
		this.rootElement.style.top = this.position.y + 'px';
	}

	/**
	* This is that can tell if two MovableEntities collided.
	* It assumes all objects are circles with a defined radius.
	* If you'd like to know more about circle collision detection, see this link:
	* https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection#Circle_Collision
	*
	* Also, this is a static method, which means it does not belong to an object, but to the class itself.
	* if you'd like to know more abou static methods, see this link:
	* https://medium.com/@yyang0903/static-objects-static-methods-in-es6-1c026dbb8bb1
	* @argument { MovableEntity } entity1
	* @argument { MovableEntity } entity2
	* @returns { boolean } Wether the objects are currently colliding or not.
	*/
	static didEntitiesColide (entity1, entity2) {
		const difference = entity1.position.subtract(entity2.position);
		const distance = difference.magnitude();

		if (distance <= (entity1.size + entity2.size) / 2) return true;
		else return false;
	}
}