/**
 * Node is a single hopfield node class. Each node takes in the weight array
 * which denotes the connectivity of the node.
 */
function Node(weights, activation, index) {
	this.weights = weights; // Weight vector as a javacript array
	this.activation = activation; // The activation of the node
	this.index = index; // Position in the network
}

/**
 * addTransposedPattern will take in a new pattern and add it to the current weights.
 * newPattern will contain the transposed bit pattern for the matrix. The 
 * transposition should happen before this point otherwise the network will
 * not store the weights correctly.
 */
Node.prototype.addTransposedPattern = function(newPattern) {
	if (newPattern.length !== this.weights.length)
		throw "Node " + this.index + ": has a different sized weight vector than the new pattern";
	// Make sure the self connection is zeroed
	newPattern[this.index] = 0;
	for (var i = 0; i < this.weights.length; i++) {
		this.weights[i] = this.weights[i] + newPattern[i];
	}
}

/**
 * calculateActivation takes in the activations of all the nodes and then
 * updates the nodes activation based on the hopfield regeneration algorithm.
 * calculateActivation returns the new activation for the node.
 */
Node.prototype.calculateActivation = function(activations) {
	var sum = 0;
	var newActivation = 0;
	for (var i = 0; i < activations.length; i++) {
		sum += activations[i] * this.weights[i];
	}
	if (sum > 0)
		newActivation = 1;
	if (sum == 0)
		newActivation = 0;
	if (sum < 0)
		newActivation = -1;
	this.activation = newActivation;
	return newActivation;		
}

/**
 * HopfieldNetwork is a hopfield network built using object oriented principles
 */
function HopfieldNetwork(nodeNum=4) {
	this.nodeNum = nodeNum; // Number of nodes that is in the network
	this.nodes = []; // Array to contain the nodes
}

/**
 * initialiseNodes will create all of the nodes for the hopfield network and
 * give them default values.
 */
HopfieldNetwork.prototype.initialiseNodes = function() {
	var activation = 0;
	for(var i = 0; i < this.nodeNum; i++) {
		var weights = [];
		for(var j = 0; j < this.nodeNum; j++) { // new weight array each time
			weights[j] = 0;
		}
		var nodeWeights = weights.slice(); // Shallow copy of zeroed weights
		this.nodes[i] = new Node(weights, activation, i);
	}
}

/**
 * addPattern will add an aditional pattern to the network. The pattern should
 * be in the form of an array and should contain the same number of elements as
 * the network has nodes. Otherwise the function will return an error.
 */
HopfieldNetwork.prototype.addPattern = function(patternArray) {
	if(typeof patternArray === 'undefined' || 
			patternArray === null ||
			patternArray.length !== this.nodeNum) { // Check if the pattern is ok
		throw "Bad Pattern!";
	}
	var newPattern = []; // The transposed pattern to add the node weights
	for (var i = 0; i < patternArray.length; i++) {
		// Calculate the transpose for the node i
		for (var j = 0; j < patternArray.length; j++) {
			newPattern[j] = patternArray[i] * patternArray[j];
			if (i === j)
				newPattern[j] = 0;
		}
		this.nodes[i].addTransposedPattern(newPattern);
	}
}

/**
 * addActivationsPattern will add a new pattern to the network based on the 
 * current activations for the nodes.
 */
HopfieldNetwork.prototype.addActivationsPattern = function() {
	return this.addPattern(this.getActivations());
}

/**
 * setActivations will set the activations of the nodes in the network.
 */
HopfieldNetwork.prototype.setActivations = function(activations) {
	if (activations.length !== this.nodes.length) {
		throw "Number of activations does not match number of network nodes!";
	}
	for (var i = 0; i < this.nodes.length; i++) {
		this.nodes[i].activation = activations[i];
	}
}

/**
 * getActivations will return an array of all the activations in order of the
 * nodes.
 */
HopfieldNetwork.prototype.getActivations = function() {
	var activations = [];
	for (var i = 0; i < this.nodes.length; i++)
		activations[i] = this.nodes[i].activation;
	return activations;
}

/**
 * recover will run the hopfield recovery algorithm until the activations of
 * the nodes no longer change and the network has converged. recover will then
 * return an array of the activations.
 */
HopfieldNetwork.prototype.recover = function() {
	var nodeChanged = true;
	var activations = this.getActivations();
	while (nodeChanged) {
		nodeChanged = false; // reset nodeChanged each loop
		var nodeOrder = this.nodes.slice(0); // nodes copy
		// loop through all the nodes in the network randomly
		while (nodeOrder.length != 0) {
			var ri = Math.floor(Math.random() * nodeOrder.length);
			var node = nodeOrder[ri];
			nodeOrder.splice(ri, 1); // remove the node
			var act = node.calculateActivation(activations);
			if (act !== activations[node.index]) {
				nodeChanged = true;
				activations[node.index] = act;
			}
		}
	}
	return activations;
}
