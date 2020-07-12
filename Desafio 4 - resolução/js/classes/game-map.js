const MAP_SIZE = new Vector(400, 400);
const FLOOR_HEIGHT = -100;

const BASE_SCORE_FOR_NEXT_LEVEL = 5;
const BASE_NUMBER_OF_ROCKS = 3;
const BASE_NUMBER_OF_DINAMITS = 1;

const STATE_PLAYING = 0;	// the play state
const STATE_LEVELUP = 1;	// the time between the levels (all object are remove ans instancite of map)

let STATE = STATE_PLAYING;

/**
* This is a class declaration
* This class is responsible for defining the GameMap behavior
* There should be only one map in the game, so this is a Singleton class.
* If you'd like to know more about the singleton pattern, see this link:
* https://en.wikipedia.org/wiki/Singleton_pattern
*
* This class extends the Entity class, which is responsible for binding the element's
* positons and directions. If you'd like to know more about class inheritance in javascript, see this link
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
*/
class GameMap extends Entity {
	/**
	* @type { GameMap | null }
	*/
	static instance = null;

	/**
	* @argument { HTMLDivElement } containerElement
	*/
	constructor (containerElement, gameOverFunction) {
		// The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		super(containerElement, MAP_SIZE);

		// Create the map's box and floor
		this.rootElement.style.border = '1px solid black';
		this.floor = new Entity(containerElement, new Vector(MAP_SIZE.x, 1), new Vector(0, FLOOR_HEIGHT));
		this.floor.rootElement.style.border = '1px solid black';
		this.floor.rootElement.style.zIndex = '2';

		// The current game level. Will increase when player captures enough gold
		this.level = 0;

		this.initializeLevel();
				
		// The function which stop the game
		this.gameOverFunction = gameOverFunction;
	 
		// load the Score on GameMap
		new InfoGame(this.containerElement);
		
		GameMap.instance = this;
	}

	/**
	* Will initialize the whole level, creating all golds, rocks and dinamits
	*/
	initializeLevel () {
		while (this.getCurrentGoldScoreInMap() < this.calculateTotalGoldScore()) {
			this.generateItem('gold');
		}

		for (let i = 0; i < this.calculateNumberOfRocks(); i ++) {
			this.generateItem('rock');
		}

		// by level only one dinamit is generate
		this.generateItem('dinamit');
	}

	/**
	 * This function load th golds, rocks and dinamits
	 */ 
	nextLevel () {
		// This markup the state upgrating
		STATE = STATE_LEVELUP;
		this.level++;
		InfoGame.atualizarLevel(this.level);
		
		// Show the message 'level up' in the map
		this.floor.rootElement.innerHTML = `<h1>Level Up! ^.^</h1>`;

		// Delete all remaining gold and rock elements after 1 second
		setTimeout(() => {
			this.floor.rootElement.innerHTML = ''; // remove text
			Gold.allGoldElements.forEach(gold => gold.delete());
			Rock.allRockElements.forEach(rock => rock.delete());
			Dinamit.allDinamitElements.forEach(dinamit => dinamit.delete());	
			this.initializeLevel();

			// This markup th state playing on game
			STATE = STATE_PLAYING;
		}, 1000);
	}

	/**
	* calculates the minimum score the player must achieve to reach the given level
	* @argument { number } level
	*/
	calculateMinimumScore (level) {
		if (level === 0) return BASE_SCORE_FOR_NEXT_LEVEL;
		else return BASE_SCORE_FOR_NEXT_LEVEL + this.level * 2 + this.calculateMinimumScore(level - 1);
	}

	/**
	* calculates the total score the level should have. It must alwasy be larger
	* than the minimum score
	*/
	calculateTotalGoldScore () {
		return this.calculateMinimumScore(this.level) + this.level * 2;
	}

	/**
	* calculates the number of rocks the level should have
	*/
	calculateNumberOfRocks () {
		return BASE_NUMBER_OF_ROCKS + this.level * 5;
	}

	/**
	* calculates the sum of the score of all existing gold in the map
	*/
	getCurrentGoldScoreInMap () {
		let score = 0;
		Gold.allGoldElements.forEach(gold => score += gold.calculateScore());
		return score;
	}

	/**
	* Checks if the two entities collidade, and if they did, call their `collided` method.
	* @argument { Entity } entity1
	* @argument { Entity } entity2
	*/
	verifyForCollision (entity1, entity2) {
		if (Entity.didEntitiesColide(entity1, entity2)) {
			entity1.collided(entity2);
			entity2.collided(entity1);
		}
	}

	/**
	* Checks if an entity is ouside the map bounding box
	* @argument { Entity } entity
	* @returns { boolean }
	*/
	isEntityOutOfBounds (entity) {
		return (
			entity.position.x >= MAP_SIZE.x / 2 ||
			entity.position.x <= -MAP_SIZE.x / 2 ||
			entity.position.y >= MAP_SIZE.y / 2 ||
			entity.position.y <= -MAP_SIZE.y / 2
		);
	}

	/**
	* Will generate either a rock element, or a gold element.
	* @argument { 'rock' | 'gold' | 'dinamit' } itemType
	*/
	generateItem (itemType) {
		let element;
		if (itemType === 'rock') element = new Rock(this.containerElement, Vector.zero);
		else if (itemType === 'gold') element = new Gold(this.containerElement, Vector.zero);
		else if (itemType === 'dinamit') element = new Dinamit(this.containerElement, Vector.zero);
		else throw new Error(`Invalid item type '${itemType}'`);

		// Checks if the new element is colliding with anything on the map
		function isElementCollidingWithAnything () {
			const isCollidingWithRocks = Rock.allRockElements.some(rock => Entity.didEntitiesColide(rock, element));
			if (isCollidingWithRocks) return true;
			const isCollidingWithGold = Gold.allGoldElements.some(gold => Entity.didEntitiesColide(gold, element));
			if (isCollidingWithGold) return true;
			const isCollidingWithDinammits = Dinamit.allDinamitElements.some(dinamit => Entity.didEntitiesColide(dinamit, element));
			if (isCollidingWithDinammits) return true;
			return false;
		}

		let timesTriedToRepositionElement = 0;

		// This whle loop will try to make sure new elements don't overlap old ones.
		// It does that by checking if the new element is colliding with anything,
		// and if it is, try again with another random position.
		do {
			const position = Vector.random;
			position.x *= (MAP_SIZE.x / 2) - 45;
			position.y *= (MAP_SIZE.y + FLOOR_HEIGHT) / 2 - 200;
			position.y -= FLOOR_HEIGHT / 2 - 50;
			element.position = position;

			// Limits the maximum amount of position rearrangements to 10.
			// This is to prevent infinite loop, or long map generation on higher
			// levels
			if (timesTriedToRepositionElement > 10) break;
			timesTriedToRepositionElement ++;
		} while (isElementCollidingWithAnything());
	}

	/**
	* If the player has a high enough score, generate the next level.
	*/
	verifyIfLevelIsOver () {
		if (InfoGame.score >= this.calculateMinimumScore(this.level)) {
			this.nextLevel();
		}
	}

	/**
	 * End of game: There is no gold on field and player still don't pass level
	 */
	isGameOver () {
		if (STATE === STATE_PLAYING && InfoGame.score < this.calculateMinimumScore(this.level)
			&& Gold.allGoldElements.length === 0) {
			return true;
		}
		return false;
	}
	
	/*
	* This function should be executed every game frame. It will call all of it's
	* movableObjects's frame functions (which will update their physics), and
	* handle any collision that happened.
	*
	* Note that this methods overrides the parent class's frame method. This is to
	* allow for behavior extension.
	*/
	frame () {

		// End game for Player
		if(this.isGameOver())
			this.gameOverFunction();

		// Call the frame function on all movableEntities
		MovableEntity.runAllFrameFunctions();

		const hook = Hook.hookElement;

		// No need to check for collision if the hook is being pulled back
		if (hook.status === 'pulling') return;

		const rockAndGoldEntities = Rock.allRockElements.concat(Gold.allGoldElements).concat(Dinamit.allDinamitElements);

		rockAndGoldEntities.forEach(entity => {
			this.verifyForCollision(hook, entity);
		});

		// pull back the hook if it's gone too far
		if (this.isEntityOutOfBounds(hook)) hook.pullBack();
	}
}