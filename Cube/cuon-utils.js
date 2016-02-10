/**
 * Create a program object and make current
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return true, if the program object was created and successfully made current, false otherwise.
 */
function initShaders(gl, vshader, fshader) {
    var program = createProgram(gl, vshader, fshader);
    if (!program) {
        console.log('failed to create program');
        return false;
    }

    gl.useProgram(program);
    gl.program = program;

    return true;
}

/**
 * Create the linked program object
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return created program object, or null if the creation has failed.
 */
function createProgram(gl, vshader, fshader) {
    // Create shader objects
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    if (!vertexShader || !fragmentShader) {
        return null;
    }

    // Create a program object
    var program = gl.createProgram();
    if (!program) {
        return null;
    }

    // Attach the shader objects
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // Link the program object
    gl.linkProgram(program);

    // Check the result of linking
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        var error = gl.getProgramInfoLog(program);
        console.log('failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }
    return program;
}

/**
 * Create a shader object
 * @param gl GL context
 * @param type the type of the shader object to be created
 * @param source a source code of a shader (string)
 * @return created shader object, or null if the creation has failed.
 */
function loadShader(gl, type, source) {
    // Create a shader object and check
    var shader = gl.createShader(type);
    if (shader == null) {
        console.log('unable to create shader');
        return null;
    }

    // Set source code of the shader
    gl.shaderSource(shader, source);

    // Compile the shader
    gl.compileShader(shader);

    // Check the result of compilation
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(shader);
        console.log('failed to compile shader: ' + error);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

/**
 * attribute変数、uniform変数の位置を取得する
 * @param gl GLコンテキスト
 * @param program リンク済みのプログラムオブジェクト
 */
function loadVariableLocations(gl, program) {
    var i, name;

    // 変数の数を取得する
    var attribCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    // attribute変数の位置と名前の対応を取得する
    var attribIndex = {};
    for (i = 0; i < attribCount; ++i) {
        name = gl.getActiveAttrib(program, i).name;
        attribIndex[name] = i;
    }

    // uniform変数の位置と名前の対応を取得する
    var uniformLoc = {};
    for (i = 0; i < uniformCount; ++i) {
        name = gl.getActiveUniform(program, i).name;
        uniformLoc[name] = gl.getUniformLocation(program, name);
    }

    // 取得した位置をプログラムオブジェクトのプロパティとして保存する
    program.attribIndex = attribIndex;
    program.uniformLoc = uniformLoc;
}

/**
 * コンテキストを初期化して取得する
 * @param canvas 描画対象のCavnas要素
 * @param opt_debug デバッグ用の初期化をするか
 * @return 初期化を完了したGLコンテキスト
 */
function getWebGLContext(canvas, opt_debug) {
    // コンテキストを取得する
    var gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) return null;

    // opt_debugに明示的にfalseが渡されなければ、デバッグ用のコンテキストを作成する
    if (arguments.length < 2 || opt_debug) {
        gl = WebGLDebugUtils.makeDebugContext(gl);
    }

    return gl;
}
