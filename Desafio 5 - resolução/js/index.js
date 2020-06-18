// This is the container of all Entities
const rootElement = document.getElementById('root');
const dashElement = document.getElementById('dashboard');

const grid = new Grid(rootElement, 10, 10);
const dash = new Dashboard(dashElement, gameOver);

const intervalHandler = dash.start();

// This is the function that will end the game
function gameOver () {
	// This will unregister the frame function, so nothing else will be updated
	clearInterval(intervalHandler);

	// The button reload
	let reloadButton = document.createElement('div');
	reloadButton.classList.add('reload');
	reloadButton.style.zIndex = 3;
	reloadButton.innerHTML = '<img src="./assets/reload.png"></img>';
	reloadButton.addEventListener('click', () => {
			window.location.reload();
	});

	// the label game over
	let restartGame = document.createElement('div');
	restartGame.classList.add("gameover");
	// restartGame.style.zIndex = 0;
	restartGame.innerHTML = '<h1>GAME OVER, BIBER!<h1><p>You must achieve the SCORE!</p>';
	restartGame.appendChild(reloadButton);

    let element = rootElement.querySelector('.grid');
    rootElement.removeChild(element);
	rootElement.appendChild(restartGame);
}