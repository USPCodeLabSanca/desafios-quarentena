const randomPhrases = require('./random-phrases');

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];

/**
 * Calcula a data e format MM DD, YYYY
 * @returns { string } The actual date
 */
function answerDate() {
    let daet  = new Date();
    let month = monthNames[daet.getMonth()];
    let day   = String(daet.getDate()).padStart(2, '0');
    let year  = daet.getFullYear();
    return month + ' '+ day  + ',' + year;
}

/**
 * In left side, there is key-words, otherside there is generic answers.
 */
const response = [
    ['criador criado', 'Meu criador é Math-O5'],
    ['hoje data dia', 'Hoje é ' + answerDate()],
    ['Por que', 'Eu não sei. Espero ter ajudado.'],
    ['Você pode ajudar ajuda help', 'Não posso, sou apenas um bot.'],
    ['baile conversar jogar quer', 'Seria increvil!'],
    ['resposta responda responde responder', 'Não tenho a solução.']
];

/**
* Decides whether the user message is relevant to the game or not. If it is relevant,
* return a true boolean flag to prevent other functions to catch a response.
*
* @argument { import('node-telegram-bot-api') } bot
* @argument { number } chatId
* @returns { boolean } A flag to indicate whether the message was used or not.
*/
function main (bot, chatId, message) {
    response.forEach(resp => {
        resp[0].split(' ').forEach(word => {
            if(message.includes(word)) {
                bot.sendMessage(chatId, resp[1]);
                message = '';
                return;
            };
        });
    });

    if(message === '') return; 
    randomPhrases.writeRandomPhrase(bot, chatId);
    return;
}

module.exports = {
	main
}