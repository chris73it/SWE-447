var vshader_src =
       'attribute vec4 a_Position;\n\
	attribute vec4 a_Color;\n\
	varying lowp vec4 v_Color;\n\
	void main() {\n\
		gl_Position = a_Position;\n\
		gl_Position.xy -= vec2(0.5);\n\
		gl_Position.xy *= 1.5 / 1.0;\n\
		v_Color = a_Color;\n\
	}';

var fshader_src =
       'precision highp float;\n\
	varying lowp vec4 v_Color;\n\
	void main() {\n\
		gl_FragColor = v_Color;\n\
	}';

var Square = {
	count : 4,
	positions : {
		values : new Float32Array([
			 0.0, 0.0, // Vertex 0
			 1.0, 0.0, // Vertex 1
			 1.0, 1.0, // Vertex 2
			 0.0, 1.0  // Vertex 3
		]),
		components : 2
	},
	colors : {
		values : new Float32Array([
			0,1,1, // Vertex 0
			1,0,0, // Vertex 1
			1,0,1, // Vertex 2
			0,1,0  // Vertex 3
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
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		alert("Failed to get a_Position");
		return;
	}
	gl.vertexAttribPointer(a_Position, Square.positions.components, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_Position);

	// Pass the colors to the vertex shader
	Square.colors.buffer = gl.createBuffer();
	if (!Square.colors.buffer) {
		console.log('Failed to create buffer for colors');
		return;
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, Square.colors.buffer);
	gl.bufferData(gl.ARRAY_BUFFER, Square.colors.values, gl.STATIC_DRAW);
	var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
	if (a_Color < 0) {
		alert("Failed to get a_Color");
		return;
	}
	gl.vertexAttribPointer(a_Color, 3/*RGB*/, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_Color);

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

