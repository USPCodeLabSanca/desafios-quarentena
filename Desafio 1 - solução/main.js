const turnText = document.getElementById('text');
let isTurnHappening = false;

// Instantiate player and opponent objects
const player = new Player(turn, turnText);
let opponent = new Squirtle(0, turnText);

function gameOver () {
	// Wait 1000 (Health loss animation)
	setTimeout(() => {
		// Open alert
		alert(`I'm sorry, you lost! Close this alert to play again`);
		window.location.reload();
		// Reload the game
	}, 1000);
}

function turn(attack) {
	// Don't start another turn till the current one is not finished
	if (isTurnHappening) return;
	else isTurnHappening = true;

	// Player turn
	player.attack(attack, opponent);
	// If Player wins do animation and create another opponent with 1 more level
	if (opponent.health === 0) {
		setTimeout(() => {
			opponent = new Squirtle(opponent.level + 1, turnText);
			turnText.innerText = 'but ' + opponent.name + ' is mysteriously ressurected!';
			player.updateHealth(player.maxHealth);
			setTimeout(() => {
				isTurnHappening = false;
				player.paralysedTurns = 0;
				turnText.innerText = 'Please choose an attack';
			}, 2000);
		}, 2000);
		turnText.innerText += ', and KILLED ' + opponent.name + '!';
		return;
	}

	// Opponents turn
	setTimeout(() => {
		opponent.attack(opponent.getRandomAttack(), player);

		if (player.health === 0) gameOver();
		setTimeout(() => {
			isTurnHappening = false;
			if (player.paralysedTurns) turn(attack);
			else turnText.innerText = 'Please choose an attack';
		}, 2000);
	}, 2000);
}
