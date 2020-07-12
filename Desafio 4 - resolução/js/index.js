// This is the container of all Entities
const movableEntityContainer = document.getElementById('movable-entity-container');

const map = new GameMap(movableEntityContainer, gameOver);
const player = new Player(movableEntityContainer);

// This is the game frame function. It is responsible for updating everything in the game.
function frame () {
	map.frame();
}

// This function will run every time the player presses a key
document.body.addEventListener('keydown', event => {
	
	// If key is the spacebar and the hooked object is a rock or gold, the play can realese it in middle of the path,
	if(event.key === 'e' && player.hook.hookedObject) {
		player.releaseHook();
	}
	
	// if that key is the spacebar, the player will try to throw it's hook.
	if (event.key === ' ') player.throwHook();
});

// Registers the frame function to run at every frame.
// if you'd like to know more about intervals, see this link
// https://javascript.info/settimeout-setinterval
const intervalHandler = setInterval(frame);

// This is the function that will end the game
function gameOver () {
	// This will unregister the frame function, so nothing else will be updated
	clearInterval(intervalHandler);

	// The button reload
	let reloadButton = document.createElement('div');
	reloadButton.classList.add('reload');
	reloadButton.style.zIndex = 3;
	reloadButton.innerHTML = '<img src="./../Desafio%204/assets/reload.png"></img>';
	reloadButton.addEventListener('click', () => {
			window.location.reload();
	});

	// the label game over
	let restartGame = document.createElement('div');
	restartGame.classList.add("gameover");
	restartGame.style.zIndex = 2;
	restartGame.innerHTML = '<h1>GAME OVER, BABY!<h1><p>You must achieve the SCORE!</p>';
	restartGame.appendChild(reloadButton);

	document.getElementById('root').appendChild(restartGame);
}