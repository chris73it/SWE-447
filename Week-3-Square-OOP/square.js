var vshader_src =
       'attribute vec4 vPosition;\n\
	void main() {\n\
		gl_Position = vPosition;\n\
	}';
//vPosition.xy -= vec2(0.5); vPosition.xy *= 1.5 / 1.0;

var fshader_src =
       'precision highp float;\n\
	void main() {\n\
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n\
	}';

var Square = {
	count : 4,
	positions : {
		values : new Float32Array([
			-1.0, -1.0, // Vertex 0
			 1.0, -1.0, // Vertex 1
			 1.0, 1.0,  // Vertex 2
			-1.0, 1.0   // Vertex 3
		]),
		components : 2
	},
	colors : {
		values : new Float32Array([
			1,0,0, // Vertex 0 (red)
			0,1,0, // Vertex 1 (green)
			0,0,1, // Vertex 2 (blue)
			0,0,1  // Vertex 3 (blue)
		]),
		components : 3
	},
	indices : {
		values : new Uint16Array([ 0, 1, 3, 2 ])
	}
};

function init() {
	var canvas = document.getElementById("webgl-canvas");
	if (!canvas) {
		alert("Failed at canvas");
		return;
	}
	
	var gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("Failed at setupWebGL");
		return;
	}
	
	if (!initShaders(gl, vshader_src, fshader_src)) {
		alert("Failed at initShaders");
		return;
	}

	// Pass the positions to the vertex shader
	Square.positions.buffer = gl.createBuffer();
	if (!Square.positions.buffer) {
		console.log('Failed to create buffer for positions');
		return;
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, Square.positions.buffer);
	gl.bufferData(gl.ARRAY_BUFFER, Square.positions.values, gl.STATIC_DRAW);
	var vPosition = gl.getAttribLocation(gl.program, 'vPosition');
	if (vPosition < 0) {
		alert("Failed to get vPosition");
		return;
	}
	gl.vertexAttribPointer(vPosition, Square.positions.components, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	
	// Pass the indices to the vertext shader
	Square.indices.buffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Square.indices.buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Square.indices.values, gl.STATIC_DRAW);

	// Clear the canvas (black)
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	// Draw the square
	//gl.drawArrays(gl.TRIANGLE_STRIP, 0, Square.count);
	gl.drawElements(gl.TRIANGLE_STRIP, Square.indices.values.length, gl.UNSIGNED_SHORT,0);
}

window.onload = init;

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);

	//gl.drawArrays(gl.TRIANGLE_STRIP, 0, Square.count);
	gl.drawElements(gl.TRIANGLE_STRIP, Square.indices.values.length, gl.UNSIGNED_SHORT,0);
}

