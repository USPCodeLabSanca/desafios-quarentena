const express = require('express');
const process = require('process');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

const messages = [];

app.use(cors());
app.use(express.json());

app.get('/messages', (req, res) => {
	res.send(messages);
});

app.post('/messages', (req, res) => {
	messages.push(req.body);
	res.send({});
});

app.listen(port, () => console.log(`Ready! Server listening on port ${port}`));