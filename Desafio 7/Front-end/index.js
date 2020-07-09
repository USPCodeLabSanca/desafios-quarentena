const serverAddress = 'http://localhost:8080';
const messageFormElement = document.getElementById('message-form');
const messagesContainerElem = document.getElementById('messages-container');
const messageTemplateElem = document.getElementById('message-template');

/**
* @typedef {{
	text: string,
	sender: { name: string, color: string },
}} Message This is the type a message
* should assume. */

/**
* @type { Message[] }
* This variable will hold all messages that were already
* rendered to the client.
*/
const renderedMessages = [];

/*
* This is an IIFE (Immediatly involked function expression). An IIFE is a function
* that is called immediatly after it's declaration, without really storing it into
* a variable. This pattern is commonly used in JavaScript to allow for "scoped"
* functions (functions that are only visible inside the scope), or to group logic
* into a single scope.
* Learn more about IIFE here:
* https://developer.mozilla.org/en-US/docs/Glossary/IIFE
*/
const myself = (() => {
	/** @argument { any[] } arr */
	function randomItemFromArray (arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	// This part is to store the "self" into the localstorage. This is to allow for
	// the user to come back as themselves later.
	const myself = localStorage.getItem('self-info');
	if (myself) return JSON.parse(myself);

	const newMyself = {
		name: `${randomItemFromArray(adjectives)} ${randomItemFromArray(animals)}`,
		color: randomItemFromArray(colors),
	}

	localStorage.setItem('self-info', JSON.stringify(newMyself));

	return newMyself;
})();

// Function executed when the user "sends" the message
messageFormElement.addEventListener('submit', event => {
	event.preventDefault();

	// Selects the input from the form
	const messageElement = messageFormElement.querySelector('input[name=message-value]');
	const messageText = messageElement.value;
	if (!messageText) return;
	const message = { text: messageText, sender: myself };
	sendMessageToServer(message);

	// Clears the message text input
	messageElement.value = '';
});

/**
* @argument { Message } message
*/
async function sendMessageToServer (message) {
	try {
		await fetch(`${serverAddress}/messages`, {
			body: JSON.stringify(message),
			headers: { 'Content-Type': 'application/json' },
			method: 'POST',
		});
	} catch (e) {
		console.error(e);
	}
}

/**
* @argument { Message } message
*/
function createMessageOnUI (message) {
	const messageNode = messageTemplateElem.content.cloneNode(true);
	const messageContainerElement = messageNode.querySelector('.message-container');
	const messageNameElement = messageNode.querySelector('.message-name');
	const messageTextElement = messageNode.querySelector('.message-text');

	messageNameElement.innerText = message.sender.name;
	messageNameElement.style.color = message.sender.color;
	messageTextElement.innerText = message.text;

	// If I was the sender, push the message element to the right
	if (message.sender.name === myself.name) {
		messageContainerElement.style.marginLeft = 'auto';
	}

	messagesContainerElem.appendChild(messageNode);
}

async function fetchMessagesFromServer () {
	/** @type { Message[] } */
	let data;
	try {
		// Note that, by deafault, the `fetch` function makes uses a `GET` request method.
		const resp = await fetch(`${serverAddress}/messages`);
		data = await resp.json();
	} catch (e) {
		console.error(e);
		return;
	}

	/**
	* Contains all messages returned from the server that were not yet rendered.
	* The ideia is that if the array of messages on the server is larger than the
	* array of messages on the client, then that means some messages are new.
	* Since the messages are placed in order on the array, you just have to get the
	* last elements of the server message's array.
	*/
	const unrenderedMessages = data.slice(renderedMessages.length);

	unrenderedMessages.forEach(newMessage => {
		createMessageOnUI(newMessage);
		renderedMessages.push(newMessage);
	});
}

setInterval(fetchMessagesFromServer, 500);