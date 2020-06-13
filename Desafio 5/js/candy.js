/**
* This is a simple collection of possible colors the candy can take.
* @type { ['blue', 'magenta', 'orange', 'black'] }
*/
let CandyColors = [
	'blue',
	'magenta',
	'orange',
	'black',
];

/**
* This is a simple collection of possible colors the candy can take ON UNLOCK level.
* @type { [cyan', 'green', 'purple'] }
*/
let BlockedCandyColors = [
	'cyan',
	'green',
	'purple',
];

/**
* Will create a new Promise that will be resolved after `time` milisseconds.
* If you'd like to know more about promisses, see this link:
* https://scotch.io/tutorials/javascript-promises-for-dummies
* @argument { number } time
*/
function sleep (time) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(); // resolves after `time` milisseconds
		}, time);
	});
}

class Candy {

	/**
	* @argument { HTMLElement } containerElement
	* @argument { number } row
	* @argument { number } column
	* @argument { number } type
	* @argument { () => void } onClick Function called when the candy is clicked.
	*/
	constructor (
		containerElement,
		row,
		column,
		type = Candy.getRandomType(),
		onClick
	) {
		this.onClick = onClick;

		// Creates the candy element.
		const element = document.createElement('div');
		element.classList.add('candy');
		containerElement.appendChild(element);
		this.rootElement = element;

		this.block = false;
		this.row = row;
		this.column = column;
		this.type = type;

		// Subscribes the `onClick` function to be called whenever the candy is clicked.
		element.addEventListener('click', onClick);
	}

	/** @returns { number } */
	static getRandomType () {
		return Math.floor(Math.random() * CandyColors.length);
	}

	/** @returns { number } */
	get row () { return this._row; }
	/** @returns { number } */
	get column () { return this._column; }
	/** @returns { number } */
	get type () { return this._type; }

	/** Will automatically update the candy's grid position, whenever it's row changes */
	set row (newRow) {
		this.rootElement.style.gridRowStart = newRow + 1;
		this._row = newRow;
	}

	/** Will automatically update the candy's grid position, whenever it's column changes */
	set column (newColumn) {
		this.rootElement.style.gridColumnStart = newColumn + 1;
		this._column = newColumn;
	}

	/** Will automatically update the candy's border color, whenever it's type changes */
	set type (newType) {
		if(CandyColors[newType] === 'black')
			this.block = true;
		this.rootElement.style.backgroundColor = CandyColors[newType];
		this._type = newType;
	}

	/** Marks the candy as highlighted (selected by the user) */
	highlight () {
		this.rootElement.classList.add('highlighted');
	}

	/** Removes the highlight mark */
	unhighlight () {
		this.rootElement.classList.remove('highlighted');
	}

	/** Will execute the candy's sliding animation.
	* Note that this is an `async` function. If you'd like to know more about async
	* functions, see this link:
	* https://scotch.io/courses/10-need-to-know-javascript-concepts/callbacks-promises-and-async
	*
	* @argument { number } time The ammount of time (in milissenconds) it will
	* take to execute the animation
	* @argument { number } offsetTop The number of pixels the candy will move to the top.
	* Negative values moves it to the bottom.
	* @argument { number } offsetLeft The number of pixels the candy will move to the left.
	* Negative values moves it to the right.
	*/
	async slide (time, offsetTop, offsetLeft) {
		this.rootElement.style.transition = time + 'ms linear';
		this.rootElement.style.top = offsetTop + 'px';
		this.rootElement.style.left = offsetLeft + 'px';
		await sleep(time);
	}

	/**
	* If the candy has been previously slided, return to it's original position,
	* without any animations.
	*/
	resetOffset () {
		this.rootElement.style.transition = ''; // Prevents animation
		this.rootElement.style.top = '';
		this.rootElement.style.left = '';
	}

	isForbidden() {
		return (CandyColors[this.type] === 'black')? true : false;
	}

	/**
	* Function called then the candy is to delete itself, after being matched with
	* other candy.
	*/
	async explode () {
		await sleep(100);
		Dashboard.candyMachted.push(this);
		this.rootElement.remove();
	}

	/**
	 * This is called to UNLOCK a new type of candy
	 * If all candy are unlock, the it will do nothing.
	 */ 
	static unlockCandy() {
		const candys = BlockedCandyColors.length;

		if(candys) {
			CandyColors.push(BlockedCandyColors[candys-1]);
			BlockedCandyColors.pop();
		}
	}
}