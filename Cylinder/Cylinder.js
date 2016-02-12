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

var Cylinder = {
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
		// Reserved for the 2 bases
		// (uses a TRIANGLE_FAN approach)
	},

	indices2 : {
		// Let init() fill this one up
		// Reserved for the lateral side
		// (uses a TRIANGLE_STRIP approach)
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

		var numSides = 8;
		var dTheta = 2.0 * Math.PI / numSides;

		// Create vertices and indeces for first base of Cylinder
		var positions = [ 0.0, 0.0, 0.0 ];  // start our positions list with the center point
		var indices = [ 0 ]; // start with the center of the triangle fan
		for ( var i = 0; i < numSides; ++i ) {
			var theta = i * dTheta;
			var x = Math.cos(theta), y = Math.sin(theta), z = 0.0;
			positions.push(x, y, z);
			indices.push(i+1);
		}
		indices.push(1);  // Add the first perimeter vertex's index to close the disk

		// Create vertices and indices for second base of Cylinder
		indices = indices.concat(indices);
		positions.push(0.0, 0.0, 1.0);
		indices[numSides+2] = numSides + 1; // start with the second center of the triangle fan
		for (var i = 0; i < numSides; ++i) {
			var theta = i * dTheta;
			var x = Math.cos(theta), y = Math.sin(theta), z = 1.0;
			positions.push(x, y, z);
			indices[numSides + i + 3] = numSides + i + 2;
		}
		indices.push(numSides+2); // Add the first perimeter vertex's index to close the disk

		// Create triangles for lateral side of Cylinder
		var indices2 = [ 1 ]; // Add the first perimeter vertex index in the first base ..
		var indices2 = [numSides+2]; // .. and add the first perimeter vertex of the second base
		for (var i = 0; i < numSides - 1; ++i) {
			indices2.push(numSides + i + 3);
			indices2.push(i + 2);
		}
		var indices2 = indices2.push(numSides+2); // Add the first perimeter vertex to close the strip

		// Create a vertex buffer for vertex positions
		Cylinder.positions.buffer = gl.createBuffer();
		if (!Cylinder.positions.buffer) {
			console.log('Failed to create buffer for positions');
			return;
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, Cylinder.positions.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
		this.a_Position = gl.getAttribLocation(gl.program, 'a_Position');
		if (a_Position < 0) {
			alert("Failed to get a_Position");
			return;
		}

		// Pass the colors to the vertex shader
		Cylinder.colors.buffer = gl.createBuffer();
		if (!Cylinder.colors.buffer) {
			console.log('Failed to create buffer for colors');
			return;
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, Cylinder.colors.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, Cylinder.colors.values, gl.STATIC_DRAW);
		this.a_Color = gl.getAttribLocation(gl.program, 'a_Color');
		if (a_Color < 0) {
			alert("Failed to get a_Color");
			return;
		}

		// Pass the indices to the vertext shader for the 2 circles
		Cylinder.indices.buffer = gl.createBuffer();
		if (!Cylinder.indices.buffer) {
			console.log('Failed to create buffer for indices');
			return;
		}
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cylinder.indices.buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

		// Pass the indices to the vertext shader for the lateral side
		Cylinder.indices2.buffer = gl.createBuffer();
		if (!Cylinder.indices2.buffer) {
			console.log('Failed to create buffer for indices2');
			return;
		}
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cylinder.indices2.buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices2), gl.STATIC_DRAW);

		// Set the clear color for the canvas
		gl.clearColor(0.0, 0.0, 0.0, 1.0);

		Cylinder.draw();
	},

	draw : function() {
		window.requestAnimationFrame(Cylinder.draw, canvas);

		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.bindBuffer(gl.ARRAY_BUFFER, Cylinder.positions.buffer);
		gl.vertexAttribPointer(a_Position, Cylinder.positions.components, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Position);

		gl.bindBuffer(gl.ARRAY_BUFFER, Cylinder.colors.buffer);
		gl.vertexAttribPointer(a_Color, Cylinder.colors.components, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Color);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cylinder.indices.buffer);

		// Render the first base of the Cylinder
		var count = 10; // We'd really like Cylinder.baseCount, or something else clever
		var offset = 0;  // Start at the beginning of the buffer
		gl.drawElements(gl.TRIANGLE_FAN, count, gl.UNSIGNED_SHORT, offset);

		// Render the second base of the Cylinder 
		count = 10;  // Same number of indices for the Cylinder as the base
		offset = 10 * /* sizeof(unsigned short) = */ 2;
		gl.drawElements(gl.TRIANGLE_FAN, count, gl.UNSIGNED_SHORT, offset);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cylinder.indices.buffer);
		
		// Render the second base of the Cylinder 
		gl.drawElements(gl.TRIANGLE_STRIP, Cylinder.indices2.length, gl.UNSIGNED_SHORT, 0);
	}
};

window.onload = Cylinder.init;

