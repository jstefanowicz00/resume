
let local_derivative = (f, x) => {
	let local_derivative_scale = .0001;
	let x_left = x * (1 - local_derivative_scale);
	let x_right = x * (1 + local_derivative_scale);
	return (f(x_right) - f(x_left)) / (x_right - x_left);
}
let local_gradient = (f, xs) => {
	let gradient = [];
	for(var i = 0; i < xs.length; i++) {
		let partial = (x) => {
			let xs_partial = [];
			for(var j = 0; j < i; j++) {
				xs_partial.push(xs[j]);
			}
			xs_partial.push(x);
			for(var j = i + 1; j < xs.length; j++) {
				xs_partial.push(xs[j]);
			}
			return f(xs_partial);
		}
		gradient.push(local_derivative(partial, xs[i]));
	}
	return gradient;
}

let random_array = (length) => {
	let arr = [];
	for(var i = 0; i < length; i++) {
		arr[i] = Math.random();
	}
	return arr;
}

let sigmoid = (x) => {
	return 1 / (1 + Math.exp(-x));
}

let weighted_sum = (xs, ws) => {
	var sum = 0;
	for(var i = 0; i < xs.length; i++) {
		sum += xs[i] * ws[i];
	}
	return sum;
}

//Access using: require('./math.js');
module.exports = {local_derivative, local_gradient, random_array, sigmoid, weighted_sum};
















