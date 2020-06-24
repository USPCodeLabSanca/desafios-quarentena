const phrases = [
	'Huh, interessante...',
	'Conte-me mais.',
	'Se você diz...',
	'Sei...',
	'Aham.',
];

function writeRandomPhrase (bot, chatId) {
	const number = Math.floor(Math.random() * phrases.length);
	bot.sendMessage(chatId, phrases[number]);
}

module.exports = {
	writeRandomPhrase
}