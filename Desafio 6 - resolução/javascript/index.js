process.env.NTBA_FIX_319 = true; // Silences an annoying error message.
const TelegramBot = require('node-telegram-bot-api');
const jokempo = require('./jokempo');
const flipCoin = require('./flip-coin');
const answerPhrases = require('./answer-question');
const token = require('./config').GLOBAL_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// save talks 
// Requiring fs module in which 
// writeFile function is defined. 
const fs = require('fs') 

// Bot.on => Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async (msg) => {

	const chatMessage = msg.text.trim().toLowerCase();
	const chatId = msg.chat.id;

	// Save data of user 
	// Write data in 'username.txt' . 
	fs.appendFile('./javascript/conversations/' + msg.chat.username + '_' + chatId + '.txt', chatMessage + ' ', (err) => { 
		// In case of a error throw err. 
		if (err) throw err; 
	}); 
	
	if (chatMessage.startsWith('ola') || chatMessage.startsWith('oi')) {
		bot.sendMessage(chatId, 'Olá! Como vai o seu dia?');
	} else if(flipCoin.main(bot, chatId, chatMessage)) {
		return; 
	} else if (jokempo.main(bot, chatId, chatMessage)) {
		return;
	} else if (chatMessage.includes('/help')) {
		bot.sendMessage(msg.chat.id, 
			"Estou a sua disposição.\n/start para conversar comigo.\n/help para ver meus seviços.\n/jokempo para jogar jokempo comigo.\n/cara-coroa para jogar cara ou coroa comigo.\n",
			{
			"reply_markup": {
				"keyboard": [["/start"], ["/help"], ["/jokempo"], ["/cara-coroa"]]
				}
			});
	} else {
		answerPhrases.main(bot, chatId, chatMessage);
        return;
	}
});
	
console.log('Fetching data...');
bot.getMe().then(me => {
	console.log(`I'm ready to serve! Talk to me on @${me.username}`);
	console.log(`or visit this link: https://t.me/${me.username}`);
});