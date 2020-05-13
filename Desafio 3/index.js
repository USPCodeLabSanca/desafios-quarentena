const movableEntityContainer = document.getElementById('movable-entity-container');

const map = new Map(movableEntityContainer);

function gameOver () {
	clearInterval(intervalHandler);
	alert('Você perdeu');
}

const player = new Player(
	movableEntityContainer,
	map,
	gameOver,
);

function frame () {
	map.frame();
	if (pressedKeys['a'] || pressedKeys['ArrowLeft']) player.turn(-1);
	if (pressedKeys['d'] || pressedKeys['ArrowRight']) player.turn(1);
}

const pressedKeys = {};

document.body.addEventListener('keydown', event => {
	if (event.key === ' ' && !pressedKeys[' ']) player.shoot();
	pressedKeys[event.key] = true;
});

document.body.addEventListener('keyup', event => {
	delete pressedKeys[event.key];
});

const intervalHandler = setInterval(frame);