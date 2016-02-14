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

var numSides = 8;

var Cone = {
	positions : {
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
		// Let init() fill this one up
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

		// Create vertices for Cone
		var dTheta = 2.0 * Math.PI / numSides;
		var positions = [ 0.0, 0.0, 0.0 ];  // start our positions list with the center point
		var indices = [ 0 ]; // start with the center of the triangle fan
		for ( var i = 0; i < numSides; ++i ) {
			var theta = i * dTheta;
			var x = Math.cos(theta), y = Math.sin(theta), z = 0.0;
			positions.push(x, y, z);
			indices.push(numSides - i);//8..1
		}
		// Add in the first perimeter vertex's index to close the disk
		indices.push(numSides);//8

		indices = indices.concat(indices);
		positions.push(0.0, 0.0, 1.0);
		indices[numSides + 2] = numSides + 1;// Start with the apex vertex
		for ( var i = 0; i < numSides; ++i ) {
			var theta = i * dTheta;
			var x = Math.cos(theta), y = Math.sin(theta), z = 0.0;
			positions.push(x, y, z);
			indices[numSides + 3 + i] = i + 1;//1..8
		}
		indices[2*(numSides+2)-1] = 1;

		// Create a vertex buffer for vertex positions
		Cone.positions.buffer = gl.createBuffer();
		if (!Cone.positions.buffer) {
			console.log('Failed to create buffer for positions');
			return;
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, Cone.positions.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
		this.a_Position = gl.getAttribLocation(gl.program, 'a_Position');
		if (a_Position < 0) {
			alert("Failed to get a_Position");
			return;
		}

		// Pass the colors to the vertex shader
		Cone.colors.buffer = gl.createBuffer();
		if (!Cone.colors.buffer) {
			console.log('Failed to create buffer for colors');
			return;
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, Cone.colors.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, Cone.colors.values, gl.STATIC_DRAW);
		this.a_Color = gl.getAttribLocation(gl.program, 'a_Color');
		if (a_Color < 0) {
			alert("Failed to get a_Color");
			return;
		}

		// Pass the indices to the vertext shader
		Cone.indices.buffer = gl.createBuffer();
		if (!Cone.indices.buffer) {
			console.log('Failed to create buffer for indices');
			return;
		}
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cone.indices.buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

		// Set the clear color for the canvas
		gl.clearColor(0.0, 0.0, 0.0, 1.0);

		Cone.draw();
	},

	draw : function() {
		window.requestAnimationFrame(Cone.draw, canvas);

		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.bindBuffer(gl.ARRAY_BUFFER, Cone.positions.buffer);
		gl.vertexAttribPointer(a_Position, Cone.positions.components, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Position);

		gl.bindBuffer(gl.ARRAY_BUFFER, Cone.colors.buffer);
		gl.vertexAttribPointer(a_Color, Cone.colors.components, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Color);

		// Render the base of the Cone
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cone.indices.buffer);
		gl.drawElements(gl.TRIANGLE_FAN, numSides+2, gl.UNSIGNED_SHORT, 0);

		// Render lateral side of the Cone
		gl.drawElements(gl.TRIANGLE_FAN, numSides+2, gl.UNSIGNED_SHORT, 2*(numSides+2));
	}
};

window.onload = Cone.init;

