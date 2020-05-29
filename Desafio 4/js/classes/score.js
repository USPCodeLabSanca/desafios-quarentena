const SCORE_SIZE = new Vector(399, 50);;
/**
* This is a class declaration
* This class is responsible for defining the gold behavior
*
* This class extends the Entity class, which is responsible for binding the element's
* positons and directions. If you'd like to know more about class inheritance in javascript, see this link
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
*/
class Score extends Entity {
	/**
	* Pontuation of player
	* @type { number }
	*/
    static score = 0;
    static level = 0;
    static rootElement;

	constructor (containerElement) {

		// The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		//super(containerElement, new Vector(1, 1).scale(SCORE_SIZE));

	    // The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		super(containerElement, SCORE_SIZE, new Vector(0, -230));

		// Create the map's box and floor
		this.rootElement.style.border = '1px solid black';
        this.rootElement.innerHTML = `<h1>Score: ${Score.score}</h1>
                                      <h1>Level: ${Score.level}</h1>`;
        this.rootElement.classList.add('score');
        Score.rootElement = this.rootElement;
    }
    
    static atualizaScore(points) {
        Score.score += points;
        Score.rootElement.innerHTML = `<h1>Score: ${Score.score}</h1>
                                        <h1>Level: ${Score.level}</h1>`;
    }

}