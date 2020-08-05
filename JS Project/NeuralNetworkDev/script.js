let brain = require('./brain.js');

let training_inputs = 
[

[0, 0, 0],
[0, 0, 1],
[0, 1, 0],
[0, 1, 1],
[1, 0, 0],
[1, 0, 1],
[1, 1, 0],
[1, 1, 1]

]

let training_labels = 
[

[0],
[0],
[0],
[0],
[1],
[0],
[0],
[0]

]

let b = brain(2, 2, 1);
training_data = [];
for(var i = 0; i < training_inputs.length; i++) {
	training_data[i] = {inputs: training_inputs[i], label: training_labels[i]};
}

//Evaluate the brain at its current training level
//i.e. no more training should occur --> the brain 'knows'
var num_correct = 0;
let evaluating = 10000;
for(var e = 0; e < evaluating; e++) {
	let data = training_data[Math.floor(Math.random() * training_data.length)];
	let inputs = data.inputs;
	let label = data.label;
	let activation = b.activate(inputs);
	if(activation[0] > .5) activation[0] = 1;
	else activation[0] = 0;
	let correct = activation[0] == label[0];
	if(correct) num_correct++;
}

console.log(evaluating + ' evaluation examples');
console.log('%' + (100 * num_correct / evaluating) + ' accuracy');

//Train the brain
b.train_over(training_data, 10000, .1);
console.log('trained the brain');

//Evaluate the brain at its current training level
//i.e. no more training should occur --> the brain 'knows'
num_correct = 0;
for(var e = 0; e < evaluating; e++) {
	let data = training_data[Math.floor(Math.random() * training_data.length)];
	let inputs = data.inputs;
	let label = data.label;
	let activation = b.activate(inputs);
	if(activation[0] > .5) activation[0] = 1;
	else activation[0] = 0;
	let correct = activation[0] == label[0];
	if(correct) num_correct++;
}

console.log(evaluating + ' evaluation examples');
console.log('%' + (100 * num_correct / evaluating) + ' accuracy');





