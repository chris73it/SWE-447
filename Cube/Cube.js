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
		gl_FragColor = vec4( 1.0, 0.0, gl_FrontFacing ? 1.0 : 0.0, 1.0 );\n\
	}';
//gl_FragColor = v_Color;\n\

var Cube = {
	positions : {
		values : new Float32Array([
			-1.0, -1.0,  1.0, // Vertex 0\
			 1.0, -1.0,  1.0, // Vertex 1 \Front
			 1.0,  1.0,  1.0, // Vertex 2 /face
			-1.0,  1.0,  1.0, // Vertex 3/
			-1.0, -1.0, -1.0, // Vertex 4\
			 1.0, -1.0, -1.0, // Vertex 5 \Back
			 1.0,  1.0, -1.0, // Vertex 6 /face
			-1.0,  1.0, -1.0  // Vertex 7/
		]),
		components : 3
	},

	colors : {
		values : new Float32Array([
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,

			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,

			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,

			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,

			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,

			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0
		]),
		components : 3
	},

	indices : {
		values : new Uint16Array([
					 4, 6, 5,   4, 7, 6,
					 0, 7, 4,   0, 3, 7,
					 1, 5, 6,   1, 6, 2,
					 2, 7, 3,   2, 6, 7,
					 1, 0, 4,   1, 4, 5,
					 0, 1, 2,   0, 2, 3
		])
	},

	init : function() {
		var canvas = document.getElementById("canvas");
		if (!canvas) {
			alert("Failed at canvas");
			return;
		}

		this.gl = WebGLUtils.setupWebGL(canvas);
		if (!gl) {
			alert("Failed at setupWebGL");
			return;
		}

		// Play with flags
		//gl.enable(gl.CULL_FACE);
		//gl.frontFace(gl.CCW);

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
		this.a_Position = gl.getAttribLocation(gl.program, 'a_Position');
		if (a_Position < 0) {
			alert("Failed to get a_Position");
			return;
		}

		// Pass the colors to the vertex shader
		Cube.colors.buffer = gl.createBuffer();
		if (!Cube.colors.buffer) {
			console.log('Failed to create buffer for colors');
			return;
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, Cube.colors.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, Cube.colors.values, gl.STATIC_DRAW);
		this.a_Color = gl.getAttribLocation(gl.program, 'a_Color');
		if (a_Color < 0) {
			alert("Failed to get a_Color");
			return;
		}

		// Pass the indices to the vertext shader
		Cube.indices.buffer = gl.createBuffer();
		if (!Cube.indices.buffer) {
			console.log('Failed to create buffer for indices');
			return;
		}
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cube.indices.buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Cube.indices.values, gl.STATIC_DRAW);

		// Set the clear color for the canvas
		gl.clearColor(0.0, 0.0, 0.0, 1.0);

		Cube.draw();
	},

	draw: function () {
		window.requestAnimationFrame(Cube.draw, canvas);

		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.bindBuffer(gl.ARRAY_BUFFER, Cube.positions.buffer);
		gl.vertexAttribPointer(a_Position, Cube.positions.components, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Position);

		gl.bindBuffer(gl.ARRAY_BUFFER, Cube.colors.buffer);
		gl.vertexAttribPointer(a_Color, Cube.colors.components, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Color);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cube.indices.buffer);

		// Draw the cube
		gl.drawElements(gl.TRIANGLES, Cube.indices.values.length, gl.UNSIGNED_SHORT, 0);
	}
};

window.onload = Cube.init;

