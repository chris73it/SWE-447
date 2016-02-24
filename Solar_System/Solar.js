/////////////////////////////////////////////////////////////////////////////
//
//  Solar.js
//
/////////////////////////////////////////////////////////////////////////////

"use strict";

//---------------------------------------------------------------------------
//
//  Declare our "global" variables, including the array of planets (each of
//    which is a sphere)
//

var canvas = undefined;
var gl = undefined;

// The list of planets to render.  Uncomment any planets that you are 
// including in the scene For each planet in this list, make sure to 
// set its distance from the sun, as well its size and colors 
var Planets = {
  Sun : new Sphere(),
  Mercury : new Sphere(),
  Venus : new Sphere(),
  Earth : new Sphere(),
  Moon : new Sphere(),
  Mars : new Sphere(),
  Jupiter : new Sphere(),
  Saturn : new Sphere(),
  Uranus : new Sphere(),
  Neptune : new Sphere(),
  Pluto : new Sphere()
};

// Viewing transformation parameters
var V = undefined;  // matrix storing the viewing transformation

// Projection transformation parameters
var P = undefined;  // matrix storing the projection transformation
var near = 10;      // near clipping plane's distance
var far = 120;      // far clipping plane's distance

// Animation variables
var time = 0.0;      // time, our global time constant, which is 
                     // incremented every frame
var timeDelta = 0.5; // the amount that time is updated each fraime

// An angular velocity that could be applied to 
var angularVelocity = Math.PI / 200;

//---------------------------------------------------------------------------
//
//  init() - scene initialization function
//

function init() {
  canvas = document.getElementById("webgl-canvas");

  // Configure our WebGL environment
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { alert("WebGL initialization failed"); }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Initialize the planets in the Planets list, including specifying
  // necesasry shaders, shader uniform variables, and other initialization
  // parameters.  This loops adds additinoal properties to each object
  // in the Planets object;
  for (var name in Planets ) {
    
    var p = Planets[name];

    p.vertexShader = "Planet-vertex-shader";
    p.fragmentShader = "Planet-fragment-shader";

    p.init(18,8); 

    p.uniforms = { 
      color : gl.getUniformLocation(p.program, "color"),
      MV : gl.getUniformLocation(p.program, "MV"),
      P : gl.getUniformLocation(p.program, "P"),
    };
  }

  resize();

  window.requestAnimationFrame(render);  
}

//---------------------------------------------------------------------------
//
//  render() - render the scene
//

function render() {
  time += timeDelta;

  var ms = new MatrixStack();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Specify the viewing transformation, and use it to initialize the 
  // matrix stack
  V = translate(0.0, 0.0, -0.5*(near + far));
  
  //Place V at the top of the stack
  ms.load(V);  //Stack: V

  // Note: You may want to find a way to use this value in your
  //  application
  var angle = time * angularVelocity;

  var DELTA = 20;
  
  //
  // Render the Sun.  Here we create a temporary variable to make it
  //  simpler to work with the various properties.
  //

  var Sun = Planets.Sun;
  var radius = SolarSystem.Sun.radius;
  var distance = SolarSystem.Sun.distance;
  var color = SolarSystem.Sun.color;
  //Copy what's at the top of the stack and push it in (V in this case)
  ms.push();  //Stack: V, V
  ms.scale(radius/2);  //Stack: V, VS
  gl.useProgram(Sun.program);
  gl.uniformMatrix4fv(Sun.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Sun.uniforms.P, false, flatten(P));
  gl.uniform4fv(Sun.uniforms.color, flatten(color));
  Sun.draw();
  ms.pop();  //Stack: V

  //
  //  Add your code for more planets here!
  //

  var Mercury = Planets.Mercury;
  radius = SolarSystem.Mercury.radius;
  distance = SolarSystem.Mercury.distance;
  color = SolarSystem.Mercury.color;
  ms.push();  //Stack: V, V
  ms.translate(distance*DELTA*Math.sin(2*angle), distance*DELTA*Math.cos(2*angle), 0);  //Stack: V, VT
  ms.scale(10*radius);  //Stack: V, VTS
  gl.useProgram(Mercury.program);
  gl.uniformMatrix4fv(Mercury.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Mercury.uniforms.P, false, flatten(P));
  gl.uniform4fv(Mercury.uniforms.color, flatten(color));
  Mercury.draw();
  ms.pop();  //Stack: V
 
  var Venus = Planets.Venus;
  radius = SolarSystem.Venus.radius;
  distance = SolarSystem.Venus.distance;
  color = SolarSystem.Venus.color;
  ms.push();  //Stack: V, V
  ms.translate(distance*DELTA*Math.sin(3*angle), distance*DELTA*Math.cos(3*angle), 0);  //Stack: V, VT
  ms.scale(radius/2);  //Stack: V, VTS
  gl.useProgram(Venus.program);
  gl.uniformMatrix4fv(Venus.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Venus.uniforms.P, false, flatten(P));
  gl.uniform4fv(Venus.uniforms.color, flatten(color));
  Venus.draw();
  ms.pop();  //Stack: V
 
  var Earth = Planets.Earth;
  radius = SolarSystem.Earth.radius;
  distance = SolarSystem.Earth.distance;
  color = SolarSystem.Earth.color;
  ms.push();  //Stack: V, V
  ms.translate(distance*DELTA*Math.sin(4*angle), distance*DELTA*Math.cos(4*angle), 0);  //Stack: V, VT
  ms.push();  //Stack: V, VT, VT
  ms.scale(radius);  //Stack: V, VT, VTS
  gl.useProgram(Earth.program);
  gl.uniformMatrix4fv(Earth.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Earth.uniforms.P, false, flatten(P));
  gl.uniform4fv(Earth.uniforms.color, flatten(color));
  Earth.draw();
  ms.pop();  //Stack: V, VT
  
  var Moon = Planets.Moon;
  radius = SolarSystem.Moon.radius;
  distance = SolarSystem.Moon.distance;
  color = SolarSystem.Moon.color;
  ms.push();  //Stack: V, VT, VT
  ms.translate(distance*25*DELTA*Math.sin(10*angle), distance*25*DELTA*Math.cos(10*angle), 0);  //Stack: V, VT, VTT
  ms.scale(2*radius);  //Stack: V, VT, VTTS
  gl.useProgram(Moon.program);
  gl.uniformMatrix4fv(Moon.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Moon.uniforms.P, false, flatten(P));
  gl.uniform4fv(Moon.uniforms.color, flatten(color));
  Moon.draw();
  ms.pop();  //Stack: V, VT
  ms.pop();  //Stack: V
  
  var Mars = Planets.Mars;
  radius = SolarSystem.Mars.radius;
  distance = SolarSystem.Mars.distance;
  color = SolarSystem.Mars.color;
  ms.push();  //Stack: V, V
  ms.translate(distance*DELTA*Math.sin(3.5*angle), distance*DELTA*Math.cos(3.5*angle), 0);  //Stack: V, VT
  ms.scale(radius);  //Stack: V, VTS
  gl.useProgram(Mars.program);
  gl.uniformMatrix4fv(Mars.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Mars.uniforms.P, false, flatten(P));
  gl.uniform4fv(Mars.uniforms.color, flatten(color));
  Mars.draw();
  ms.pop();  //Stack: V
 
  var Jupiter = Planets.Jupiter;
  radius = SolarSystem.Jupiter.radius;
  distance = SolarSystem.Jupiter.distance;
  color = SolarSystem.Jupiter.color;
  ms.push();  //Stack: V, V
  ms.translate(0.35*distance*DELTA*Math.sin(2.5*angle), 0.35*distance*DELTA*Math.cos(2.5*angle), 0);  //Stack: V, VT
  ms.scale(radius/5);  //Stack: V, VTS
  gl.useProgram(Jupiter.program);
  gl.uniformMatrix4fv(Jupiter.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Jupiter.uniforms.P, false, flatten(P));
  gl.uniform4fv(Jupiter.uniforms.color, flatten(color));
  Jupiter.draw();
  ms.pop();  //Stack: V
 
  var Saturn = Planets.Saturn;
  radius = SolarSystem.Saturn.radius;
  distance = SolarSystem.Saturn.distance;
  color = SolarSystem.Saturn.color;
  ms.push();  //Stack: V, V
  ms.translate(0.3*distance*DELTA*Math.sin(1.3*angle), 0.3*distance*DELTA*Math.cos(1.3*angle), 0);  //Stack: V, VT
  ms.scale(radius/5);  //Stack: V, VTS
  gl.useProgram(Saturn.program);
  gl.uniformMatrix4fv(Saturn.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Saturn.uniforms.P, false, flatten(P));
  gl.uniform4fv(Saturn.uniforms.color, flatten(color));
  Saturn.draw();
  ms.pop();  //Stack: V
  
  var Uranus = Planets.Uranus;
  radius = SolarSystem.Uranus.radius;
  distance = SolarSystem.Uranus.distance;
  color = SolarSystem.Uranus.color;
  ms.push();  //Stack: V, V
  ms.translate(0.13*distance*DELTA*Math.sin(1.7*angle), 0.13*distance*DELTA*Math.cos(1.7*angle), 0);  //Stack: V, VT
  ms.scale(radius/5);  //Stack: V, VTS
  gl.useProgram(Uranus.program);
  gl.uniformMatrix4fv(Uranus.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Uranus.uniforms.P, false, flatten(P));
  gl.uniform4fv(Uranus.uniforms.color, flatten(color));
  Uranus.draw();
  ms.pop();  //Stack: V
   
  var Neptune = Planets.Neptune;
  radius = SolarSystem.Neptune.radius;
  distance = SolarSystem.Neptune.distance;
  color = SolarSystem.Neptune.color;
  ms.push();  //Stack: V, V
  ms.translate(0.1*distance*DELTA*Math.sin(1*angle), 0.1*distance*DELTA*Math.cos(1*angle), 0);  //Stack: V, VT
  ms.scale(radius/5);  //Stack: V, VTS
  gl.useProgram(Neptune.program);
  gl.uniformMatrix4fv(Neptune.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Neptune.uniforms.P, false, flatten(P));
  gl.uniform4fv(Neptune.uniforms.color, flatten(color));
  Neptune.draw();
  ms.pop();  //Stack: V
  
  var Pluto = Planets.Pluto;
  radius = SolarSystem.Pluto.radius;
  distance = SolarSystem.Pluto.distance;
  color = SolarSystem.Pluto.color;
  ms.push();  //Stack: V, V
  ms.translate(0.1*distance*DELTA*Math.sin(0.5*angle), 0.1*distance*DELTA*Math.cos(0.5*angle), 0);  //Stack: V, VT
  ms.scale(radius*2);  //Stack: V, VTS
  gl.useProgram(Pluto.program);
  gl.uniformMatrix4fv(Pluto.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Pluto.uniforms.P, false, flatten(P));
  gl.uniform4fv(Pluto.uniforms.color, flatten(color));
  Pluto.draw();
  ms.pop();  //Stack: V
  
  window.requestAnimationFrame(render);
}

//---------------------------------------------------------------------------
//
//  resize() - handle resize events
//

function resize() {
  var w = canvas.clientWidth;
  var h = canvas.clientHeight;

  gl.viewport(0, 0, w, h);

  var fovy = 120.0; // degrees
  var aspect = w / h;

  P = perspective(fovy, aspect, near, far);
}

//---------------------------------------------------------------------------
//
//  Window callbacks for processing various events
//

window.onload = init;
window.onresize = resize;
