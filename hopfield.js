/**
 * Node is a single hopfield node class. Each node takes in the weight array
 * which denotes the connectivity of the node.
 */
function Node(weights, activation, index) {
	this.weights = weights; // Weight vector as a javacript array
	this activation = activation; // The activation of the node
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
	var weights = [];
	for(var i = 0; i < this.nodeNum; i++) {
		weights[i] = 0;
	}
	var activation = 0;
	for(var i = 0; i < this.nodeNum; i++) {
		var nodeWeights = weights.slice(); // Shallow copy of zeroed weights
		this.nodes = new Node(weights, activationi, i);
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
	var pattern = []; // Make pattern from activations
	for (var i = 0; i < this.nodes.length; i++)
		pattern[i] = this.nodes[i].activation;
	return this.addPattern(pattern);
}

/**
 * setActivations will set the activations of the nodes in the network.
 */
HopfieldNetwork.prototype.setActivations = function(activations) {
	if (activations.length !== this.nodes.length) {
		throw "Number of activations does not match number of network nodes!";
	}
	for (var i = 0; i < nodes.length; i++) {
		this.nodes[i].activation = activations[i];
	}
}
