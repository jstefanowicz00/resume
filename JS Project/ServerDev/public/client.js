
//////////////////////////////////////////////////
// LOCATION: SERVERDEV/PUBLIC
// FILE_NAME: CLIENT.JS
//////////////////////////////////////////////////

//Connect to the servers input/output
let connection = io.connect('localhost:9000');

//Received after successfully connecting to the input/output
connection.on('connection', (id) => {
	
});

connection.on('completeRequest', (data) => {
	console.log(data);
	results.innerText += '\n';
	results.innerText += data.company;
	results.innerText += '  |  price: ' + data.price;
	results.innerText += '  |  volume: ' + data.volume;
})

let text = document.getElementById('tickerText');
let button = document.getElementById('button');
let results = document.getElementById('results');

button.addEventListener('click', () => {
	connection.emit('request', text.value);
});