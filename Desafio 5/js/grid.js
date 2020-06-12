/**
* The speed (in milisseconds / grid space) in which candy will slide in any given
* direction.
* @type { number }
*/
const CANDY_SLIDING_SPEED = 200;

/**
* Will create a new Promise that will be resolved after `time` milisseconds.
* If you'd like to know more about promisses, see this link:
* https://scotch.io/tutorials/javascript-promises-for-dummies
* @argument { number } time
*/
function sleep (time) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, time);
	});
}

class Grid {
	/**
	* @argument { HTMLElement } containerElement
	* @argument { number } rows
	* @argument { number } columns
	*/
	constructor (containerElement, rows, columns) {
		this.rows = rows;
		this.columns = columns;

		/** Candy are squares. This is the length (in pixels) they should have in order
		* not to create a map that is larger thant the user's screen.
		* @type { number }
		*/
		this.blockSize = null;

		/** The width of the map, in pixels
		* @type { number }
		*/
		this.width = null;

		/** The height of the map, in pixels
		* @type { number }
		*/
		this.height = null;

		/** This array will hold all contents of the grid, like all Candy.
		* @type { Candy[][] }
		*/
		this.contents = [];

		/** This variable is essential for the game working. The player cannot play if,
		* for example, there is an animation currently running.
		* @type { bool }
		*/
		this.canPlayerPlay = true;

		/** Will store the currently selected candy.
		* @type { Candy }
		*/
		this.selectedCandy = null;

		// Creates the grid's element'
		const element = document.createElement('div');
		this.rootElement = element;
		element.classList.add('grid');
		element.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
		element.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
		containerElement.appendChild(element);

		// The `.bind` we are calling is just so we can tie the function to the `this` variable.
		this.updateGridDimensions = this.updateGridDimensions.bind(this);

		// Initializes the grid dimensions.
		this.updateGridDimensions();

		// Whenever the window is resized, the grid should recalculate it's size.
		window.addEventListener('resize', this.updateGridDimensions);

		// Creates all candies
		for (let row = 0; row < this.rows; row ++) {
			this.contents.push([]);
			for (let column = 0; column < this.columns; column ++) {
				this.contents[row].push(this.createCandy(row, column));
			}
		}

		// This piece of code will make sure the game doesn't start with an already
		// matching combination in the grid. If the game finds an already matching
		// combination, it will change the type of a randomly selected candy that
		// composes the combination.
		let possibleExplosions = this.findAllPossibleExplosions();
		while (possibleExplosions.length > 0) {
			possibleExplosions.forEach(explosion => {
				const randomExplosionIndex = Math.floor(Math.random() * explosion.length);
				explosion[randomExplosionIndex].type = Candy.getRandomType();
			});
			possibleExplosions = this.findAllPossibleExplosions();
		}
	}

	/**
	* Creates a candy element, tying it up to the grid
	* @argument { number } row
	* @argument { number } column
	*/
	createCandy (row, column) {
		const newCandy = new Candy(
			this.rootElement,
			row,
			column,
			undefined,
			() => this.onClick(newCandy),
		);
		return newCandy;
	}

	/**
	* Will update the grid's dimensions according to it's container. It will
	* always make sure that all candy are squares.
	*/
	updateGridDimensions () {
		this.rootElement.style.width = '';
		this.rootElement.style.height = '';
		const blockWidth = this.rootElement.clientWidth / this.columns;
		const blockHeight = this.rootElement.clientHeight / this.rows;
		this.blockSize = Math.min(blockWidth, blockHeight);
		this.width = this.columns * this.blockSize;
		this.height = this.rows * this.blockSize;
		this.rootElement.style.width = this.width + 'px';
		this.rootElement.style.height = this.height + 'px';
	}

	/**
	* This function should be called whenever a candy is clicked.
	* @argument { Candy } candy The candy that was clciked.
	*/
	onClick (candy) {
		// Te player will usually be unable to play whenever an animation is running.
		if (this.canPlayerPlay === false) return;

		// If there was no previously selected candy, select the clicked one.
		if (!this.selectedCandy) {
			this.select(candy);
		}
		// If the previously selected candy was clciked again, unselect it
		else if (candy === this.selectedCandy) {
			this.select(null);
		}
		// If a neighbor is clicked, try to swap them.
		else if (this.areCandyNeighbors(this.selectedCandy, candy)) {
			this.swapCandy(this.selectedCandy, candy);
			this.select(null); // Clears the selected candy
		}
		// If it was not a neighbor, override the currently selected candy with
		// the clicked one.
		else this.select(candy);
	}

	/**
	* Will select a given candy, unselecting any previously selected candy.
	* If a null value is passed, no candy will be selected
	* @argument { Candy | null } candy
	*/
	select (candy) {
		if (this.selectedCandy) this.selectedCandy.unhighlight();
		this.selectedCandy = candy;
		if (candy) candy.highlight();
	}

	/**
	* Verifies is the two candies are neighbors in the grid.
	* @argument { Candy } candy1
	* @argument { Candy } candy2
	*/
	areCandyNeighbors (candy1, candy2) {
		const distance = Math.hypot(candy1.row - candy2.row, candy1.column - candy2.column);
		// They will only be neighbors if their distance is exactly 1.
		return distance === 1;
	}

	/**
	* Will run the animation of sliding a candy to the given coordinates, with a
	* constant speed.
	* @argument { Candy } candy
	* @argument { number } newRow
	* @argument { number } newColumn
	*/
	async animateCandy (candy, newRow, newColumn) {
		// Transforms the grid offset into pixel offset.
		const offsetLeft = (newColumn - candy.column) * this.blockSize;
		const offsetTop = (newRow - candy.row) * this.blockSize;

		// Considers the current offset the candy might have.
		const totalOffsetTop = offsetTop - parseFloat(candy.rootElement.style.top || 0);
		const totalOffsetLeft = offsetLeft - parseFloat(candy.rootElement.style.left || 0);

		// Time is calculted so all moving candy have the same speed
		const time = CANDY_SLIDING_SPEED * Math.hypot(totalOffsetLeft, totalOffsetTop) / this.blockSize;
		await candy.slide(time, offsetTop, offsetLeft);
	}

	/**
	* Will effectively settle the given candy in the given position, updating the
	* grid and the candy's internal state.
	* @argument { Candy } candy
	* @argument { number } row
	* @argument { number } column
	*/
	commitCandyPosition (candy, row, column) {
		candy.row = row;
		candy.column = column;
		this.contents[candy.row][candy.column] = candy;
		candy.resetOffset();
	}

	/**
	* Will move the given candy to the given position, updating the grid and the
	* candy's internal states. If the given position is currently occupied, the
	* two candies will swap position, without any animation.
	* @argument { Candy } candy
	* @argument { number } newRow
	* @argument { number } newColumn
	*/
	async moveCandy (candy, newRow, newColumn) {
		const target = this.contents[newRow][newColumn];
		await Promise.all([
			this.animateCandy(candy, newRow, newColumn),
			target && this.animateCandy(target, candy.row, candy.column),
		]);
		if (target) this.commitCandyPosition(target, candy.row, candy.column);
		this.commitCandyPosition(candy, newRow, newColumn);
	}

	/**
	* Will try to swap two candies. This function should be called as a response
	* to the player clicking two neighbor candy.
	* @argument { Candy } candy1
	* @argument { Candy } candy2
	*/
	async swapCandy (candy1, candy2) {
		// Since some animations will now start, prevents the player from playing
		this.canPlayerPlay = false;

		// swaps the two candy.
		await this.moveCandy(candy1, candy2.row, candy2.column);
		const didAnythingExplode = await this.explodeAll();

		// If nothing exploded, just go back to how it was.
		if (!didAnythingExplode) {
			await sleep(100);
			await this.moveCandy(candy2, candy1.row, candy1.column);
		}
		// If somwthing exploded, apply gravity to all candy, and check for further
		// possible explosions.
		else {
			await this.applyGravity();
			while (await this.explodeAll()) {
				await this.applyGravity();
			}
		}

		// Now that all animations finished, allow the player to play again.
		this.canPlayerPlay = true;
	}

	/**
	* This is a helper function. It will call it's callback for all grid positions.
	* @template { Function } T
	* @argument { T } callback
	* @returns { ReturnType<T>[] }
	*/
	forEachCandy (callback) {
		const results = [];
		for (let i = 0; i < this.rows; i ++) {
			for (let j = 0; j < this.columns; j ++) {
				const candy = this.contents[i][j];
				results.push(callback(candy, i, j));
			}
		}
		return results;
	}

	/**
	* Function called when a candy is matched, and should be deleted
	* @argument { Candy } candy
	*/
	async explodeCandy (candy) {
		await candy.explode();
		this.contents[candy.row][candy.column] = null;
	}

	/**
	* This function will explode all found matches.
	* @returns { boolean } Whether any explosions occurred or not.
	*/
	async explodeAll () {
		const explosions = this.findAllPossibleExplosions();

		const results = await Promise.all(
			explosions.map(async explosion => {
				await Promise.all(
					explosion.map(candy => this.explodeCandy(candy))
				);
				return true;
			})
		);
		return results.some(e => e);
	}

	/**
	* Returns all matches currentyl on the grid.
	* @returns { Candy[][]}
	*/
	findAllPossibleExplosions () {
		const explosions = [];
		for (let row = 0; row < this.rows; row ++) {
			for (let column = 0; column < this.columns; column ++) {
				const candy = this.contents[row][column];
				if (!candy) continue;
				const explosion = this.findExplosionAroundCandy(candy);
				if (explosion) explosions.push(explosion);
			}
		}
		return explosions;
	}

	/**
	* Returns the largest match around a candy.
	* @argument { Candy } candy
	* @returns { Candy[] | null }
	*/
	findExplosionAroundCandy (candy) {
		/**
		* Finds the largest set o consecutive candies of the same type.
		* @argument { number } offsetRow
		* @argument { number } offsetColumn
		*/
		const findLargestGroup = (offsetRow, offsetColumn) => {
			const group = [];
			let target = candy;
			while (target && target.type === candy.type) {
				group.push(target);
				const newRow = target.row + offsetRow;
				const newColumn = target.column + offsetColumn;
				if (this.isOutOfBounds(newRow, newColumn)) break; // Don't go out of bounds
				target = this.contents[newRow][newColumn];
			}
			return group;
		}

		// Gets all sets of matches around the candy that are larger than 3
		const possibleGroups = [
			findLargestGroup(0, 1),
			findLargestGroup(0, -1),
			findLargestGroup(1, 0),
			findLargestGroup(-1, 0),
		].filter(group => group.length >= 3);

		if (possibleGroups.length === 0) return null;

		// Find the largest set.
		let largestGroup = [];
		possibleGroups.forEach(group => {
			if (group.length > largestGroup.length) largestGroup = group;
		});

		return largestGroup;
	}

	/**
	* Tells if a position on the grid is valid.
	* @argument { number } row
	* @argument { number } column
	*/
	isOutOfBounds (row, column) {
		return (
			row < 0 ||
			row >= this.rows ||
			column < 0 ||
			column >= this.columns
		);
	}

	/**
	* Makes all floating blocks fall. This function is called after an explosion happens.
	*/
	async applyGravity () {
		/**
		* Will run the animation to make the given candy fall.
		* @argument { Candy } candy
		* @argument { number } fallingAmmount The ammount of tiles the candy should fall.
		*/
		const fall = async (candy, fallingAmmount) => {
			await this.animateCandy(candy, candy.row + fallingAmmount, candy.column),
			this.contents[candy.row][candy.column] = null;
			this.commitCandyPosition(candy, candy.row + fallingAmmount, candy.column);
		}

		/**
		* Will create replacements for all the empty holes, and run the animation to
		* make them fall to their places.
		* @argument { number } row
		* @argument { number } column
		* @argument { number } fallingAmmount
		*/
		const createReplacement = async (row, column, fallingAmmount) => {
			const newCandy = this.createCandy(0, column);
			newCandy.rootElement.style.top = -this.blockSize * (fallingAmmount - row) + 'px';
			await sleep(100);
			await this.animateCandy(newCandy, row, column);
			this.commitCandyPosition(newCandy, row, column);
		}

		const promisses = [];
		for (let column = 0; column < this.columns; column ++) {
			let emptySpaces = 0;

			// Makes candy fall to the right place.
			for (let row = this.rows - 1; row >= 0; row --) {
				const candy = this.contents[row][column];
				if (!candy) {
					emptySpaces ++;
					continue;
				}
				if (!emptySpaces) continue;
				promisses.push(fall(candy, emptySpaces));
			}

			// Creates the replacements for the current row
			for (let row = 0; row < emptySpaces; row ++) {
				promisses.push(createReplacement(row, column, emptySpaces));
			}
		}

		// Waits for all animations to finish executing.
		await Promise.all(promisses);
	}
}