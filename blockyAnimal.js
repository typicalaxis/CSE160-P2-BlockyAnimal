// Blocky Animals.js Benjamin Grinnell
// Vertex shader program
var VSHADER_SOURCE =
  `attribute vec4 a_Position;
   uniform mat4 u_ModelMatrix;
   uniform mat4 u_GlobalRotateMatrix;
   void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
   }`

// Fragment shader program
var FSHADER_SOURCE =
 `precision mediump float;
  uniform vec4 u_FragColor;  
  void main() {
    gl_FragColor = u_FragColor;
  }`

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;


let g_globalXAngle = 0;
let g_globalYAngle = 0;
let clickX;
let clickY;
let newX;
let newY;

let g_tail1Angle = 0;
let g_tail2Angle = 0;
let g_anim1 = false;
let pokeAnim = false;

let g_lleg1Angle = 35;
let g_rleg1Angle = 35;
let g_lleg2Angle = 90;
let g_rleg2Angle = 90;

let g_lfootAngle = 200;
let g_rfootAngle = 200;

let bodyAngle = 0;
let tail1ZAngle = 0;
let tail2ZAngle = 0;

let g_head1Angle = 0;
let g_head2Angle = 0;

let g_head1YAngle = -5;
let g_head2YAngle = 5;




function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true})
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
}
function setUpHtmlUI(){
    

    document.getElementById("tail1Slide").addEventListener("mousemove",function(){if(!g_anim1){g_tail1Angle = this.value;}});
    document.getElementById("tail2Slide").addEventListener("mousemove",function(){if(!g_anim1){g_tail2Angle = this.value;}});

    document.getElementById("angleSlide").addEventListener("mousemove",function(){g_globalYAngle = this.value; renderScene();});

    document.getElementById("onButton").onclick = function(){g_anim1 = true;g_AstartTime = performance.now()/1000.0; renderScene();};
    document.getElementById("offButton").onclick = function(){g_anim1 = false};

    
    
}
var g_startTime = performance.now()/1000.0;
var g_AstartTime = 0;
var g_seconds = performance.now()/1000.0 - g_startTime;
var g_secondsA = performance.now()/1000.0 - g_AstartTime;

function tick(){
    g_seconds = performance.now()/1000.0 - g_startTime;
    g_secondsA = performance.now()/1000.0 - g_AstartTime;
    if(pokeAnim && g_secondsA > 3){
        pokeAnim =false;
    }
    updateAnimationAngles();
    renderScene();
    requestAnimationFrame(tick);
}
function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
    
}

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    setUpHtmlUI();
    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev){if(ev.buttons == 1){mMove(ev)}};
    

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    

    requestAnimationFrame(tick);
}


var g_shapesList = [];

//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes = [];
function click(ev) {
    if(ev.shiftKey){
        pokeAnim = true;
        animTimer = performance.now()/1000.0;
        g_AstartTime = performance.now()/1000.0;
    }
    else{
        clickX = ev.clientX; // x coordinate of a mouse pointer
        clickY = ev.clientY; // y coordinate of a mouse pointer
    }
}
function mMove(ev){
    newX = ev.clientX; // x coordinate of a mouse pointer
    newY = ev.clientY; // y coordinate of a mouse pointer
    g_globalYAngle = newX - clickX;
    g_globalXAngle = newY - clickY;
    renderScene();
}
var animTimer = 0;
function updateAnimationAngles(){
    if(pokeAnim){
        g_head1YAngle = (15*(Math.abs(Math.sin(g_secondsA))));
        g_head2YAngle = (25*(Math.abs(Math.sin(g_secondsA))));

        g_lleg1Angle = 25;
        g_rleg1Angle = 25;

        g_lleg2Angle = 90;
        g_rleg2Angle = 90;

        g_lfootAngle = 200;
        g_rfootAngle = 200;

        g_tail1Angle = (15*(Math.sin(g_secondsA)));
        g_tail2Angle = (15*(Math.sin(g_secondsA)));
    }
    else if(g_anim1){
        g_lleg1Angle = 25+(65*(-(Math.sin(g_secondsA))));
        g_rleg1Angle = 25+(65*(Math.sin(g_secondsA)));

        g_lleg2Angle = 90-(10*(Math.sin(g_secondsA)));
        g_rleg2Angle = 90-(10*(Math.sin(g_secondsA)));

        g_lfootAngle = 200-(10*(Math.sin(g_secondsA)));
        g_rfootAngle = 200-(10*(Math.sin(g_secondsA)));

        bodyAngle = (10*(Math.sin(g_secondsA)));
        if(!pokeAnim){
            g_head1Angle = (15*(Math.sin(g_secondsA)));
            g_head2Angle = (15*(Math.sin(g_secondsA)));
        }

        tail1ZAngle = (25*(Math.sin(g_secondsA)));
        tail2ZAngle = (25*(Math.sin(g_secondsA)));
    }
}
function renderScene(){
    var startTime = performance.now();

    var globalRotMat = new Matrix4().rotate(g_globalXAngle,1,0,0);
    globalRotMat.rotate(g_globalYAngle,0,1,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);

    
    var body = new Cube();
    body.color = [0.0,1.0,0.0,1.0];
    body.matrix.translate(-.35,-.25,-.25);
    body.matrix.rotate(15,0,0,1);
    body.matrix.rotate(bodyAngle,0.5,0,0);
    body.matrix.scale(0.9,0.4,0.4);
    body.render();

    var lleg1 = new Cube();
    lleg1.color = [0.0,1.0,0.0,1.0];
    lleg1.matrix.translate(0.05,0.2,0.15);
    lleg1.matrix.rotate(g_lleg1Angle,0,0,1);

    var lleg1Coord = new Matrix4(lleg1.matrix);
    lleg1.matrix.scale(-0.3,-0.7,0.4);
    lleg1.render();

    var lleg2 = new Cube();
    lleg2.color = [0.0,1.0,0.0,1.0];
    lleg2.matrix = lleg1Coord;
    lleg2.matrix.translate(-0.75,-.55,0.05);
    lleg2.matrix.rotate(g_lleg2Angle,0,0,1);
    var lleg2Coord = new Matrix4(lleg2.matrix);
    lleg2.matrix.scale(-0.2,-0.6,0.3);
    lleg2.render();

    var lfoot = new Cube();
    lfoot.color = [0.0,1.0,0.0,1.0];
    lfoot.matrix = lleg2Coord;
    lfoot.matrix.translate(-0.10,.10,-0.05);
    lfoot.matrix.rotate(g_lfootAngle,0,0,1);
    lfoot.matrix.scale(0.5,0.1,0.4);
    lfoot.render();
    
    var rleg1 = new Cube();
    rleg1.color = [0.0,1.0,0.0,1.0];
    rleg1.matrix.translate(0.05,0.2,-0.65);
    rleg1.matrix.rotate(g_rleg1Angle,0,0,1);
    var rleg1Coord = new Matrix4(rleg1.matrix);
    rleg1.matrix.scale(-0.3,-0.7,0.4);
    rleg1.render();

    var rleg2 = new Cube();
    rleg2.color = [0.0,1.0,0.0,1.0];
    rleg2.matrix = rleg1Coord;
    rleg2.matrix.translate(-0.75,-.55,0.05);
    rleg2.matrix.rotate(g_rleg2Angle,0,0,1);
    var rleg2Coord = new Matrix4(rleg2.matrix);
    rleg2.matrix.scale(-0.2,-0.6,0.3);
    rleg2.render();

    var rfoot = new Cube();
    rfoot.color = [0.0,1.0,0.0,1.0];
    rfoot.matrix = rleg2Coord;
    rfoot.matrix.translate(-0.10,.10,-0.05);
    rfoot.matrix.rotate(g_lfootAngle,0,0,1);
    rfoot.matrix.scale(0.5,0.1,0.4);
    rfoot.render();

    var tail1 = new Cube();
    tail1.color = [0.0,1.0,0.0,1.0];
    tail1.matrix.translate(-.3,-.2,-.2);
    tail1.matrix.rotate(-tail1ZAngle,0,0.5,0);
    tail1.matrix.rotate(-g_tail1Angle,0,0,1);
    var tail1Coord = new Matrix4(tail1.matrix);
    tail1.matrix.scale(-0.6,0.3,0.3);
    tail1.render();

    var tail2 = new Cube();
    tail2.color = [0.0,1.0,0.0,1.0];
    tail2.matrix = tail1Coord;
    tail2.matrix.translate(-0.55,.05,0.05);
    tail2.matrix.rotate(-tail2ZAngle,0,0.5,0);
    tail2.matrix.rotate(-g_tail2Angle,0,0,1);
    tail2.matrix.scale(-0.4,0.2,0.2);
    tail2.render();

    var head1 = new Cube();
    head1.color = [0.0,1.0,0.0,1.0];
    head1.matrix.translate(.35,.25,-.35);
    head1.matrix.rotate(g_head1Angle,0,.5,0);
    head1.matrix.rotate(-g_head2YAngle,0,0,1);
    head1.matrix.scale(0.6,0.2,0.6);
    head1.render();

    var head2 = new Cube();
    head2.color = [0.0,1.0,0.0,1.0];
    head2.matrix.translate(0.35,.4,-.35);
    head2.matrix.rotate(g_head2Angle,0,0.5,0);
    head2.matrix.rotate(g_head2YAngle,0,0,1);
    var head2Coord = new Matrix4(head2.matrix);
    head2.matrix.scale(0.6,0.3,0.6);
    head2.render();

    
    var horn1 = new Cone();
    horn1.color = [.9,.9,.9];
    horn1.matrix = head2Coord;
    horn1.matrix.translate(0.15,.30,0.3);
    horn1.matrix.rotate(-90,1,0,0);
    horn1.matrix.scale(0.05,0.05,0.05);
    horn1.render();

    var horn2 = new Cone();
    horn2.color = [.9,.9,.9];
    horn2.matrix = head2Coord;
    horn2.matrix.translate(2.35,.0,0.0);
    horn2.render();

    var horn3 = new Cone();
    horn3.color = [.9,.9,.9];
    horn3.matrix = head2Coord;
    horn3.matrix.translate(2.35,.0,0.0);
    horn3.render();
    

    var duration = performance.now() - startTime;
    sendTextToHTML(" ms  "+ Math.floor(duration)+" fps   " + Math.floor(10000/duration)/10, "performance");
}
function convertCoordinatesEventToGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();


    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return([x,y]);
}
function sendTextToHTML(text, htmlID){
    var HTMLElm = document.getElementById(htmlID);
    if(!HTMLElm){
        console.log("failed to get "+ htmlID + "from html");
        return;
    }

    HTMLElm.innerText = text;
}
