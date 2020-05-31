const INITIAL_DINAMITS = 1;
const INFOGAME_SIZE = new Vector(399, 50);

/**
* This is a class declaration
* This class is responsible for defining the show Info Game Player, like score, level and itens.
*
* This class extends the Entity class, which is responsible for binding the element's
* positons and directions. If you'd like to know more about class inheritance in javascript, see this link
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
*/
class InfoGame extends Entity {
	/**
	* Pontuation of player
	* @type { number }
	*/
    static score = 0;
	static level = 0;
	static dinamits = INITIAL_DINAMITS;
    static rootElement;

	constructor (containerElement) {

		// The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		//super(containerElement, new Vector(1, 1).scale(SCORE_SIZE));

	    // The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		super(containerElement, INFOGAME_SIZE, new Vector(0, -230));

		// Create the map's box and floor
		this.rootElement.style.border = '1px solid black';
        this.rootElement.innerHTML = `<h1>Score: ${InfoGame.score}</h1>
										<h3>Release(E): ${InfoGame.dinamits}</h3>
										<h1>Level: ${InfoGame.level}</h1>`;
        this.rootElement.classList.add('score');
        InfoGame.rootElement = this.rootElement;
    }
    
    static atualizaScore(score) {
        InfoGame.score = score;
		InfoGame.rootElement.innerHTML = `<h1>Score: ${InfoGame.score}</h1>
											<h3>Release(E): ${InfoGame.dinamits}</h3>
											<h1>Level: ${InfoGame.level}</h1>`;
	}
	
	static atualizarLevel(level) {
        InfoGame.level = level;
		InfoGame.rootElement.innerHTML = `<h1>Score: ${InfoGame.score}</h1>
											<h3>Release(E): ${InfoGame.dinamits}</h3>
											<h1>Level: ${InfoGame.level}</h1>`;
	}
	
	static atualizarDinamite(dinamits) {
        InfoGame.dinamits = dinamits;
		InfoGame.rootElement.innerHTML = `<h1>Score: ${InfoGame.score}</h1>
											<h3>Release(E): ${InfoGame.dinamits}</h3>
											<h1>Level: ${InfoGame.level}</h1>`;
    }


}