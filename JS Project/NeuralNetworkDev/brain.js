let math = require('./math.js');

let nueron = () => {

	//Create the nueron model object
	let nueron_model = {};

	//Create the nuerons weight vector
	//	- indecies [0...weights.length - 2] represent weights
	//	- index weights.length - 1 represents bias
	let weights = [];

	//Getter for weights array
	nueron_model.get_weights = () => {
		return weights;
	}

	//Setter for weights array
	//Used to easily calculate a cost function
	nueron_model.set_weights = (ws) => {
		for(var i = 0; i < ws.length; i++) {
			weights[i] = ws[i];
		}
	}

	//Input: inputs array
	//Returns: an activation [0...1]
	nueron_model.activate = (inputs) => {

		//Ensure input data matches weight data
		if(inputs.length != weights.length - 1) {
			weights = math.random_array(inputs.length + 1);
		}

		//Compute weighted sum
		let sum = math.weighted_sum(inputs, weights);
		sum += weights[weights.length - 1];

		//Activation function
		return math.sigmoid(sum);
	}

	//Inputs: cost function of weights per specific input data
	nueron_model.train = (cost, learning_rate) => {

		//Compute the cost gradient
		let gradient = math.local_gradient(cost, weights);

		//Adjust weights away from gradient vector
		for(var i = 0; i < weights.length; i++) {
			weights[i] -= gradient[i] * learning_rate;
		}
	}

	//Return the completed nueron model
	return nueron_model;
}

let brain = (num_layers, mid_layer_depth, num_outputs) => {

	//Create the brain model object
	let brain_model = {};

	//Create layers array
	//Holds arrays of nodes for each layer
	let layers = [];
	for(var i = 0; i < num_layers; i++) {

		//Create an empty node layer
		let layer = []

		//Add new nodes to the layers
		//If final layer, nodes must match num_outputs
		//Otherwise nodes should match mid_layer_depth
		if(i == num_layers - 1) {

			//This layer is the output layer
			//Add num_outputs nodes
			for(var j = 0; j < num_outputs; j++) {
				layer[j] = nueron();
			}
		} else {

			//This layer is not the output layer
			//Add mid_layer_depth nodes
			for(var j = 0; j < mid_layer_depth; j++) {
				layer[j] = nueron();
			}
		}

		//Add layer to layers array
		layers[i] = layer;
	}

	//Helper function to recursively compute
	//each layers activations
	let activate_layer = (inputs, layer_index) => {

		//Create an empty activations array
		let activations = [];

		//Recursive check base case:
		//Is the current layer the first layer?
		if(layer_index == 0) {

			//This is the first layer
			//Compute activations with inputs
			for(var i = 0; i < layers[layer_index].length; i++) {
				activations[i] = layers[layer_index][i].activate(inputs);
			}
		} else {

			//This is not the first layer
			//Compute activations with previous layers activations
			for(var i = 0; i < layers[layer_index].length; i++) {
				activations[i] = layers[layer_index][i].activate(activate_layer(inputs, layer_index - 1));
			}
		}

		//Return the layers activations
		return activations;
	}

	//Computes the entire brains activation
	//Returns the activations of the output layers nuerons
	brain_model.activate = (inputs) => {
		return activate_layer(inputs, num_layers - 1);
	}

	//For every nueron in the brain, calculate
	//its cost gradient with respect to its weights
	brain_model.train = (inputs, label, learning_rate) => {
		//Require that the brain has fired at least once with this data
		brain_model.activate(inputs);

		//Visit every nueron
		for(var i = 0; i < layers.length; i++) {
			for(var j = 0; j < layers[i].length; j++) {

				//Cost function for the specific nueron
				let cost = (weights) => {

					//Remember the original weights
					let weights_0 = layers[i][j].get_weights();

					//Set the weights to the function parameter
					layers[i][j].set_weights(weights);

					//Compute the brains activation
					let activation = brain_model.activate(inputs);

					//Set weights back to original
					layers[i][j].set_weights(weights_0);

					//Compute the error
					var error = 0;
					for(var k = 0; k < activation.length; k++) {
						error += (activation[k] - label[k]) * (activation[k] - label[k]);
					}

					//Return error to represent cost
					return error;
				}

				//Train each nueron based on the cost function
				//and supplied learning rate
				layers[i][j].train(cost, learning_rate);
			}
		}
	}

	brain_model.train_over = (training_data, iterations, learning_rate) => {
		for(var iter = 0; iter < iterations; iter++) {
			let training_example = Math.floor(training_data.length * Math.random());
			let data = training_data[training_example];
			let inputs = data.inputs;
			let label = data.label;
			brain_model.train(inputs, label, learning_rate)
		}
	}

	return brain_model;
}

module.exports = brain;


// //Everything below this line is how you would
// //implement the above brain object...
// let b = brain(3, 3, 1);

// training = 100;
// evaluating = 100000;

// //Train the brain on known data and expected output
// for(var t = 0; t < training; t++) {
// 	let inputs = [100 * Math.random(), 100 * Math.random(), 100 * Math.random(), 100 * Math.random()];
// 	var label = [0];
// 	if(inputs[0] > inputs[1] + inputs[2] + inputs[3]) label[0]++;
// 	//console.log({x: inputs[0], y: inputs[1], label: label});
// 	b.train(inputs, label, .1);
// }

// //Evaluate the brain at its current training level
// //i.e. no more training should occur --> the brain 'knows'
// var num_correct = 0;
// for(var e = 0; e < evaluating; e++) {
// 	let inputs = [100 * Math.random(), 100 * Math.random(), 100 * Math.random(), 100 * Math.random()];
// 	var label = [0];
// 	if(inputs[0] > inputs[1] + inputs[2] + inputs[3]) label[0]++;
// 	let activation = b.activate(inputs);
// 	if(activation[0] > .5) activation[0] = 1;
// 	else activation[0] = 0;
// 	let correct = activation[0] == label[0];
// 	if(correct) num_correct++;
// }

// console.log(training + ' training examples');
// console.log(evaluating + ' evaluation examples');
// console.log('%' + (100 * num_correct / evaluating) + ' accuracy');







