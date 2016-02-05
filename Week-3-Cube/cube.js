var vshader_src =
       'attribute vec4 a_Position;\n\
	attribute vec4 a_Color;\n\
	varying lowp vec4 v_Color;\n\
	void main() {\n\
		gl_Position = a_Position;\n\
		v_Color = a_Color;\n\
	}';

var fshader_src =
       'precision mediump float;\n\
	varying lowp vec4 v_Color;\n\
	void main() {\n\
		gl_FragColor = v_Color;\n\
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
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		alert("Failed to get a_Position");
		return;
	}
	gl.vertexAttribPointer(a_Position, Cube.positions.components, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_Position);

	// Pass the colors to the vertex shader
        Cube.colors.buffer = gl.createBuffer();
        if (!Cube.colors.buffer) {
                console.log('Failed to create buffer for colors');
                return;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, Cube.colors.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, Cube.colors.values, gl.STATIC_DRAW);
        var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
        if (a_Color < 0) {
                alert("Failed to get a_Color");
                return;
        }
        gl.vertexAttribPointer(a_Color, 3/*RGB*/, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Color);
	
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

