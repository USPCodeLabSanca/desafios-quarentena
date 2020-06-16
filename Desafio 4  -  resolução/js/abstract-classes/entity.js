/**
* This is a class declaration
* This class is supposed to be abstract. If you'd like to know more about abstract
* classes, see this link:
* https://hackernoon.com/abstract-classes-and-oop-extras-d087eeb1aca9
* This class is responsible for defining the game's entity behavior. An entity is
* anything that has a visual representaiton (a DOM element associated to it).
* Since entities exist in the world, it should have a position, a direction and
* methods to manipulate those things.
*/
class Entity {
	/**
	* This array will contain all existing entities. It's useful to keep track of
	* what is curently on the screen.
	* Also, this is a static property. If you'd like to know more about static properties, see this link:
	* https://javascript.info/static-properties-methods
	* @type { Entity[] }
	*/
	static existingEntities = [];

	/**
	* @argument { HTMLDivElement } containerElement The element that will contain
	* the visula represntation of the entity
	* @argument { Vector } size The size of the entity (x is width, y is height)
	* @argument { Vector } initialPosition
	* @argument { Vector } direction
	*/
	constructor (
		containerElement,
		size = new Vector(10, 10),
		initialPosition = Vector.zero,
		direction = Vector.up,
	) {
		// Creates the element that will visually represent this MobableEntity
		this.rootElement = document.createElement('div');
		this.rootElement.classList.add('entity');

		// these styles are set in case the entity has a background image
		this.rootElement.style.backgroundSize = 'contain';
		this.rootElement.style.backgroundRepeat = 'no-repeat';
		this.rootElement.style.backgroundPosition = 'center';

		this.size = size;
		this.position = initialPosition;
		this.direction = direction;

		// Adds the element to the DOM.
		// If you'd like to know more about the DOM and it's manipulation, see the link:
		// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents#Moving_and_removing_elements
		containerElement.appendChild(this.rootElement);
		this.containerElement = containerElement;

		// Add object to entities list.
		Entity.existingEntities.push(this);
	}

	/**
	* This is a getter function (because it has a 'get' before it's name). If you'd
	* like to know more about getters, see this link
	* https://javascript.info/property-accessors
	*
	* This function will return the angle in degrees of the object's direction with
	* the Y axis, where 0 degress means an upwards vector. If you'd like to know
	* more about this, see this link
	* https://chortle.ccsu.edu/VectorLessons/vch05/vch05_3.html
	* @returns { number }
	*/
	get angle () {
		let angle = Math.atan(this.direction.y / this.direction.x) + 2.5 * Math.PI;
		if (this.direction.x < 0) angle -= Math.PI;
		return angle % (2 * Math.PI);
	}

	/**
	* This is a setter function (because it has a 'set' before it's name). If you'd
	* like to know more about setters, see this link
	* https://javascript.info/property-accessors
	*
	* This function will update the direction vector so it has the specified angle
	* @argument { Vector } angle the angle in degrees
	*/
	set angle (angle) {
		this.direction = Vector.up.rotate(angle);
	}

	get size () {
		return this._size;
	}

	/**
	* This setter is to update the DOM element's height and width along with it's size.
	* @argument { Vector } newSize
	*/
	set size (newSize) {
		this._size = newSize;
		this.rootElement.style.height = newSize.y + 'px';
		this.rootElement.style.width = newSize.x + 'px';

		// If it's displaying the entity's hittbox, update it too.
		if (this.hitbox) {
			const size = Math.max(this.size.x, this.size.y);
			this.hitbox.size = new Vector(size, size);
		}
	}

	get direction () {
		return this._direction;
	}

	/**
	* This setter is to update the element's rotation along with it's direction.
	* @argument { Vector } newDirection
	*/
	set direction (newDirection) {
		// Makes sure the new direction is normalized
		this._direction = newDirection.normalize();
		// The `translate(-50%, -50%)` part is just to keep the element's center
		// with the vector's representation. This is necessary because an element's top
		// and left position mark's the element's top-left corner, and not it's center.
		this.rootElement.style.transform = `translate(-50%, -50%) rotate(${this.angle}rad)`;
	}

	get position () {
		return this._position;
	}

	/**
	* This setter is to update the DOM element's position.
	* @argument { Vector } newPosition
	*/
	set position (newPosition) {
		this._position = newPosition.duplicate();
		this.rootElement.style.top = newPosition.y + 'px';
		this.rootElement.style.left = newPosition.x + 'px';

		// If the entity is displaying it's hitbox, update it too
		if (this.hitbox) this.hitbox.position = this.position;
	}

	/**
	* This method is currently empty because it should be overriden by Entity's
	* children classes. If you'd like to know more about overriding a method, see this link
	* https://javascript.info/class-inheritance#overriding-a-method
	* @argument { Entity } objectThatCollided The object that collided with
	* this.
	*/
	collided (objectThatCollided) {
		// Function to override
	}

	/**
	* This is a debugging function. It will draw the entity's hitbox on the screen.
	* Since collision detection assumes everything is a circle, the hitbox will also be
	* a circle. If you'd like to know more about hitboxes, the this link:
	* https://en.wikipedia.org/wiki/Collision_detection#Hitbox
	*/
	drawHitbox () {
		// Do nothing if the hitbox is already being shown
		if (this.hitbox) return;
		const size = Math.max(this.size.x, this.size.y);
		this.hitbox = new Entity(this.containerElement, new Vector(size, size), this.position, this.direction);

		// Removes the hitbox from the Entity's list, because hitboxes are debugging objects
		// and should not be seen in any other part of the game.
		Entity.existingEntities.splice(Entity.existingEntities.findIndex(e => e === this.hitbox), 1);

		// Draws the hitbox's border
		this.hitbox.rootElement.style.border = '1px solid black';
		this.hitbox.rootElement.style.borderRadius = '100%';
	}

	/**
	* Disable a previously shown hitbox.
	*/
	hideHitbox () {
		if (!this.hitbox) return;
		this.hitbox.rootElement.remove();
		this.hitbox = null;
	}

	/**
	* This method removes the Entity's element from the DOM, and the entities list
	*/
	delete () {
		// Here, we will find the index of the entity, and use it to remove the element from the
		// movableEntities array.
		// If you don't know how the splice method works, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
		// If you dont't know how the findIndex method works, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
		const index = Entity.existingEntities.findIndex(e => e === this);
		if (index !== -1) Entity.existingEntities.splice(index, 1);

		this.hideHitbox();
		this.rootElement.remove();
	}

	/**
	* This is that can tell if two Entities collided.
	* It assumes all objects are circles with a defined radius.
	* If you'd like to know more about circle collision detection, see this link:
	* https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection#Circle_Collision
	*
	* Also, this is a static method, which means it does not belong to an object, but to the class itself.
	* if you'd like to know more about static methods, see this link:
	* https://medium.com/@yyang0903/static-objects-static-methods-in-es6-1c026dbb8bb1
	* @argument { MovableEntity } entity1
	* @argument { MovableEntity } entity2
	* @returns { boolean } Wether the objects are currently colliding or not.
	*/
	static didEntitiesColide (entity1, entity2) {
		if (entity1 === entity2) return false;

		const difference = entity1.position.subtract(entity2.position);
		const distance = difference.magnitude();

		const getEntitySize = entity => Math.max(entity.size.x, entity.size.y);

		if (distance <= (getEntitySize(entity1) + getEntitySize(entity2)) / 2) return true;
		else return false;
	}
}