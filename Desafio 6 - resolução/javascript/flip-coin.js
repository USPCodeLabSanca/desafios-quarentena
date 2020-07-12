let isPlayingHeadTail = false;
let botCoin = null;

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
* @returns { 'cara' | 'coroa' }
*/
function flipCoin () {
	const number = Math.floor(Math.random() * 2);
	return ['coroa', 'cara'][number];
}

/**
* Decides who won the game
* @argument { string } playerChoice
* @argument { string } botCoin
* @returns { 'player' | 'bot' | 'tie' | 'invalid play' }
*/
function whoWon (playerChoice, botCoin) {
	if (
		(playerChoice === 'cara' && botCoin === 'cara') ||
		(playerChoice === 'coroa' && botCoin === 'coroa')
	) return 'player';
	else if (
		(playerChoice === 'cara' && botCoin === 'coroa') ||
		(playerChoice === 'coroa' && botCoin === 'cara')
	) return 'bot';
	else return 'invalid play';
}

/**
* This function will initiate the start game.
* @argument { import('node-telegram-bot-api') } bot
* @argument { number } chatId
*/
async function startPlaying (bot, chatId) {
	
	await bot.sendMessage(chatId, 'Legal! vamos jogar! A moeda foi lançada');
	await sleep(300);
	await bot.sendMessage(chatId, 'Escolha Cara ou Coroa!!');

	// Changes state to waiting player make a move
	isPlayingHeadTail = true;
	
	// choice the answer
	botCoin = flipCoin();
	await sleep(2500);

	// if the state is waiting a moving, then the player is cheating
	if (isPlayingHeadTail) {
		isPlayingHeadTail = false;
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
	const winner = whoWon(message, botCoin);
	const response = {
		'player': 'Você ganhou! Parabens!\n' + botCoin + '!!!',
		'bot': 'Opa! Essa eu ganhei! Boa sorte na próxima!\n' + botCoin + '!!!',
		'tie': 'Parece que empatamos! Mas o jogo ainda foi divertido.\n' + botCoin + '!!!',
	}[winner] || `Eu só entendo 'cara', 'coroa'!!!!`;
	bot.sendMessage(chatId, response);
	isPlayingHeadTail = false;
	botCoin = null;
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
	if (isPlayingHeadTail) {
		// If it was already playing, then this must be an user response
		readUserResponse(bot, chatId, message);
		return true;
	} else if (message === '/cara-coroa') {
		startPlaying(bot, chatId);
		return true;
	} else {
		return false;
	}
}

module.exports = {
	main
}