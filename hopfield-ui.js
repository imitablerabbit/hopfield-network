var canvas = document.getElementById("hopfield-canvas");
var context = canvas.getContext("2d");
var resetButton = document.getElementById("reset-button");
var clearButton = document.getElementById("clear-button");
var storeButton = document.getElementById("store-button");
var recoverButton = document.getElementById("recover-button");
var widthInput = document.getElementById("width-input");
var heightInput = document.getElementById("height-input");
var nodeWidth = widthInput.value;
var nodeHeight = heightInput.value;
var network = new HopfieldNetwork(nodeWidth * nodeHeight);
network.initialiseNodes();

window.onload = function() {
	canvas.height = 200;
	canvas.width = 200;
	drawNodes();
	resetButton.addEventListener("click", reset);
	clearButton.addEventListener("click", clear);
	recoverButton.addEventListener("click", recover);
	storeButton.addEventListener("click", store);
	canvas.addEventListener("click", canvasMouseHandler);
	widthInput.addEventListener("mouseup", resizeNetwork);
	heightInput.addEventListener("mouseup", resizeNetwork);
	widthInput.addEventListener("keyup", resizeNetwork);
	heightInput.addEventListener("keyup", resizeNetwork);
}

function drawNodes() {
	var width = canvas.width / nodeWidth;
	var height = canvas.height / nodeHeight;
	for (var i = 0; i < nodeHeight; i++) { 
		var y = height * i;
		for (var j = 0; j < nodeWidth; j++) {
			var x = width * j;
			var act = network.nodes[(nodeWidth * i) + j].activation;
			if (act > 0)
				drawHighActivation(x, y, width, height);
			if (act < 0 || act == 0)
				drawLowActivation(x, y, width, height);
		}
	}
}

function drawLowActivation(x, y, width, height) {
	context.fillStyle = "#FFFFFF";
	context.strokeStyle="#000000";
	context.fillRect(x, y, width, height);
	context.strokeRect(x, y, width, height);
}

function drawHighActivation(x, y, width, height) {
	context.fillStyle = "#000000";
	context.strokeStyle = "#000000";
	context.fillRect(x, y, width, height);
	context.strokeRect(x, y, width, height);
}

function reset() {
	network.initialiseNodes();
	drawNodes();
}

function recover() {
	network.recover();
	drawNodes();
}

function store() {
	network.addActivationsPattern();
}

function canvasMouseHandler(evt) {
	var mouseX = evt.pageX - canvas.offsetLeft;
	var mouseY = evt.pageY - canvas.offsetTop;
	var x = Math.floor(mouseX / (canvas.width / nodeWidth));
	var y = Math.floor(mouseY / (canvas.height / nodeHeight));
	var node = network.nodes[(nodeHeight * y) + x];
	if (node.activation > 0)
		node.activation = -1;
	else 
		node.activation = 1;
	drawNodes();
}

function clear() {
	for (var i = 0; i < network.nodes.length; i++)
		network.nodes[i].activation = 0;
	drawNodes();
}

function resizeNetwork() {
	if (nodeWidth == widthInput.value && nodeHeight == heightInput.value)
		return
	nodeWidth = widthInput.value;
	nodeHeight = heightInput.value;
	network = new HopfieldNetwork(nodeWidth * nodeHeight);
	network.initialiseNodes();
	drawNodes();
}
