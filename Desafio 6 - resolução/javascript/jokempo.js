let isPlayingJokempo = false;
let botChoice = null;

/**
* Just a simple sleep function. It will return a promisse that will resolve itself
* in `time` milisseconds.
* @argument { number } time The time in Milisseconds the function will wait.
* @returns { Promise<void> }
*/
function sleep (time) {
	return new Promise(resolve => {
		setTimeout(() => resolve(), time);
	});
}

/**
* Makes a random choice between moves.
* @returns { 'pedra' | 'papel' | 'tesoura' }
*/
function makeAChoice () {
	const number = Math.floor(Math.random() * 3);
	return ['pedra', 'papel', 'tesoura'][number];
}

/**
* Decides who won the game
* @argument { string } playerChoice
* @argument { string } botChoice
* @returns { 'player' | 'bot' | 'tie' | 'invalid play' }
*/
function whoWon (playerChoice, botChoice) {
	if (
		(playerChoice === 'pedra' && botChoice === 'tesoura') ||
		(playerChoice === 'papel' && botChoice === 'pedra') ||
		(playerChoice === 'tesoura' && botChoice === 'papel')
	) return 'player';
	else if (
		(playerChoice === 'pedra' && botChoice === 'papel') ||
		(playerChoice === 'papel' && botChoice === 'tesoura') ||
		(playerChoice === 'tesoura' && botChoice === 'pedra')
	) return 'bot';
	else if (
		(playerChoice === 'pedra' && botChoice === 'pedra') ||
		(playerChoice === 'papel' && botChoice === 'papel') ||
		(playerChoice === 'tesoura' && botChoice === 'tesoura')
	) return 'tie';
	else return 'invalid play';
}

/**
* This function will initiate the jokempo game.
* @argument { import('node-telegram-bot-api') } bot
* @argument { number } chatId
*/
async function startPlaying (bot, chatId) {
	await bot.sendMessage(chatId, 'Legal! vamos jogar!');
	await sleep(1000);
	await bot.sendMessage(chatId, 'jo');
	await sleep(1000);
	await bot.sendMessage(chatId, 'quem');
	await sleep(1000);
	await bot.sendMessage(chatId, 'POO!!');
	isPlayingJokempo = true;
	await sleep(500);
	botChoice = makeAChoice();
	await bot.sendMessage(chatId, botChoice + '!!!');
	await sleep(1500);
	if (isPlayingJokempo) {
		isPlayingJokempo = false;
		await bot.sendMessage(chatId, 'Você demorou demais! Você está tentando trapacear?');
	}
}

/**
* Function called when the user sent a message after already starting to play jokempo
* It will tell if the user
*
* @argument { import('node-telegram-bot-api') } bot
* @argument { number } chatId
* @returns { boolean } A flag to indicate whether the message was used or not.
*/
function readUserResponse (bot, chatId, message) {
	const winner = whoWon(message, botChoice);
	const response = {
		'player': 'Você ganhou! Parabens!',
		'bot': 'Opa! Essa eu ganhei! Boa sorte na próxima!',
		'tie': 'Parece que empatamos! Mas o jogo ainda foi divertido.',
	}[winner] || `Eu só entendo 'pedra', 'papel' ou 'tesoura'!!!!`;
	bot.sendMessage(chatId, response);
	isPlayingJokempo = false;
	botChoice = null;
}

/**
* Decides whether the user message is relevant to the game or not. If it is relevant,
* return a true boolean flag to prevent other functions to catch a response.
*
* @argument { import('node-telegram-bot-api') } bot
* @argument { number } chatId
* @returns { boolean } A flag to indicate whether the message was used or not.
*/
function main (bot, chatId, message) {
	if (isPlayingJokempo) {
		// If it was already playing, then this must be an user response
		readUserResponse(bot, chatId, message);
		return true;
	} else if (message === '/jokempo') {
		startPlaying(bot, chatId);
		return true;
	} else {
		return false;
	}
}

module.exports = {
	main
}