var vshader_src =
       'attribute vec4 vPosition;\n\
	void main() {\n\
		gl_Position = vPosition;\n\
	}';

//vPosition.xyz -= vec2(0.5); vPosition.xyz *= 1.5 / 1.0;

var fshader_src =
       'precision highp float;\n\
	void main() {\n\
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n\
	}';

var Cube = {
	count : 8,
	positions : {
		values : new Float32Array([
			 0.0,  0.0,  0.0, // Vertex 0 \
			 1.0,  0.0,  0.0, // Vertex 1  \front
			 1.0,  1.0,  0.0, // Vertex 2  /face
			 0.0,  1.0,  0.0, // Vertex 3 /
			 0.0,  0.0, -1.0, // Vertex 4 \
			 1.0,  0.0, -1.0, // Vertex 5  \back
			 1.0,  1.0, -1.0, // Vertex 6  /face
			 0.0,  1.0, -1.0  // Vertex 7 /
		]),
		components : 3
	},
	colors : {
		values : new Float32Array([
			1,0,0, // Vertex 0 (red)
			0,1,0, // Vertex 1 (green)
			0,0,1, // Vertex 2 (blue)
			0,0,1, // Vertex 3 (blue)
			1,0,0, // Vertex 4 (red)
			0,1,0, // Vertex 5 (green)
			0,0,1, // Vertex 6 (blue)
			0,0,1  // Vertex 7 (blue)
		]),
		components : 3
	},
	indices : {
		values : new Uint16Array([ 0, 1, 2,   0, 2, 3, //front
					   4, 6, 5,   4, 7, 6, //back
					   1, 5, 6,   1, 6, 2, //right
					   0, 7, 4,   0, 3, 7, //left
					   3, 2, 6,   3, 6, 7, //up
					   0, 5, 1,   0, 4, 5  //down
		])
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
	Cube.positions.buffer = gl.createBuffer();
	if (!Cube.positions.buffer) {
		console.log('Failed to create buffer for positions');
		return;
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, Cube.positions.buffer);
	gl.bufferData(gl.ARRAY_BUFFER, Cube.positions.values, gl.STATIC_DRAW);
	var vPosition = gl.getAttribLocation(gl.program, 'vPosition');
	if (vPosition < 0) {
		alert("Failed to get vPosition");
		return;
	}
	gl.vertexAttribPointer(vPosition, Cube.positions.components, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	
	// Pass the indices to the vertext shader
	Cube.indices.buffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cube.indices.buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Cube.indices.values, gl.STATIC_DRAW);

	// Clear the canvas (black)
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	// Draw the square
	//gl.drawArrays(gl.TRIANGLE, 0, Cube.count);
	gl.drawElements(gl.TRIANGLE, Cube.indices.values.length, gl.UNSIGNED_SHORT,0);
}

window.onload = init;

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);

	//gl.drawArrays(gl.TRIANGLE, 0, Cube.count);
	gl.drawElements(gl.TRIANGLE, Cube.indices.values.length, gl.UNSIGNED_SHORT,0);
}

