var pMatrix = mat4.create();
var mvMatrix = mat4.create();
var cameraOffset = mat4.create();

mat4.translate(cameraOffset, cameraOffset, [0, -0.5, -4]);
// mat4.rotate(cameraOffset, cameraOffset, 0 * (Math.PI / 180), [0, 1, 0]);
mat4.rotate(cameraOffset, cameraOffset, 35 * (Math.PI / 180), [1, 0, 0]);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
var stage = document.getElementById('stage'),
    gl = stage.getContext('webgl');

gl.enable(gl.DEPTH_TEST);

// cube
//  vertices = [
//     // Front face
//     -1.0, -1.0,  1.0,
//      1.0, -1.0,  1.0,
//      1.0,  1.0,  1.0,
//     -1.0,  1.0,  1.0,

//     // Back face
//     -1.0, -1.0, -1.0,
//     -1.0,  1.0, -1.0,
//      1.0,  1.0, -1.0,
//      1.0, -1.0, -1.0,

//     // Top face
//     -1.0,  1.0, -1.0,
//     -1.0,  1.0,  1.0,
//      1.0,  1.0,  1.0,
//      1.0,  1.0, -1.0,

//     // Bottom face
//     -1.0, -1.0, -1.0,
//      1.0, -1.0, -1.0,
//      1.0, -1.0,  1.0,
//     -1.0, -1.0,  1.0,

//     // Right face
//      1.0, -1.0, -1.0,
//      1.0,  1.0, -1.0,
//      1.0,  1.0,  1.0,
//      1.0, -1.0,  1.0,

//     // Left face
//     -1.0, -1.0, -1.0,
//     -1.0, -1.0,  1.0,
//     -1.0,  1.0,  1.0,
//     -1.0,  1.0, -1.0,
// ];

// cube
// var faces = [
//     0, 1, 2,      0, 2, 3,    // Front face
//     4, 5, 6,      4, 6, 7,    // Back face
//     8, 9, 10,     8, 10, 11,  // Top face
//     12, 13, 14,   12, 14, 15, // Bottom face
//     16, 17, 18,   16, 18, 19, // Right face
//     20, 21, 22,   20, 22, 23  // Left face
// ];


// cube
// var textureCoordinates = [
//     // Front face
//     0.0, 0.0,
//     1.0, 0.0,
//     1.0, 1.0,
//     0.0, 1.0,

//     // Back face
//     1.0, 0.0,
//     1.0, 1.0,
//     0.0, 1.0,
//     0.0, 0.0,

//     // Top face
//     0.0, 1.0,
//     0.0, 0.0,
//     1.0, 0.0,
//     1.0, 1.0,

//     // Bottom face
//     1.0, 1.0,
//     0.0, 1.0,
//     0.0, 0.0,
//     1.0, 0.0,

//     // Right face
//     1.0, 0.0,
//     1.0, 1.0,
//     0.0, 1.0,
//     0.0, 0.0,

//     // Left face
//     0.0, 0.0,
//     1.0, 0.0,
//     1.0, 1.0,
//     0.0, 1.0
// ];

// plane

var vertices = [
	1.000000, 0.000000, 1.000000, 
	-1.000000, 0.000000, 1.000000, 
	1.000000, 0.000000, -1.000000, 
	-1.000000, 0.000000, -1.000000, 
	0.000000, 0.000000, 1.000000, 
	0.000000, 0.000000, -1.000000
];

var faces = [
	4, 0, 2, // 0, 0, 1 ----- 1, 0, 1 ----- 1, 0, -1
	1, 4, 5, // -1, 0, 1 ----- 0, 0, 1 ----- 0, 0, -1
	5, 4, 2, // 0, 0, -1 ----- 0, 0, 1 ----- 1, 0, -1
	3, 1, 5 // -1, 0, -1 ----- -1, 0, 1 ----- 0, 0, -1
];


// f 5/1 1/2 3/3
// f 2/4 5/1 6/5
// f 6/5 5/1 3/3
// f 4/6 2/4 6/5

// 1 v 1.000000 0.000000 1.000000
// 2 v -1.000000 0.000000 1.000000
// 3 v 1.000000 0.000000 -1.000000
// 4 v -1.000000 0.000000 -1.000000
// 5 v 0.000000 0.000000 1.000000
// 6 v 0.000000 0.000000 -1.000000

// 1 vt 0.500000 1.000000
// 2 vt 0.000000 1.000000
// 3 vt 0.000000 0.000000
// 4 vt 1.000000 1.000000
// 5 vt 0.500000 0.000000
// 6 vt 1.000000 0.000000

var textureCoordinates =  [
	1, 0,
	0, 0,
	1, 1,
	0, 1,
	0.5, 0,
	0.5, 1
];


vertexPositionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

vertexPositionBuffer.itemSize = 3;
vertexPositionBuffer.numItems = vertices.length / 3;

var vertexIndexBuffer = gl.createBuffer();

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), gl.STATIC_DRAW);

var vshaderInput = document.getElementById('v-shader').textContent,
    fshaderInput = document.getElementById('f-shader').textContent;

program = gl.createProgram();

var vshader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vshader, vshaderInput);
gl.compileShader(vshader);

var fshader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fshader, fshaderInput);
gl.compileShader(fshader);

gl.attachShader(program, vshader);
gl.attachShader(program, fshader);
gl.linkProgram(program);

gl.useProgram(program);

program.vertexPosAttrib = gl.getAttribLocation(program, 'aVertexPosition');
gl.enableVertexAttribArray(program.vertexPosAttrib);

program.textureCoordinates = gl.getAttribLocation(program, 'aTextureCoordinates');
gl.enableVertexAttribArray(program.textureCoordinates);

program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
program.cameraOffsetUniform = gl.getUniformLocation(program, "uCameraOffset");
program.uSampler = gl.getUniformLocation(program, "uSampler");

gl.viewport(0, 0, stage.width, stage.height);

gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

mat4.perspective(pMatrix, 45, stage.width / stage.height, 0.1, 100.0);
mat4.identity(mvMatrix);

gl.uniformMatrix4fv(program.pMatrixUniform, false, pMatrix);
gl.uniformMatrix4fv(program.mvMatrixUniform, false, mvMatrix);
gl.uniformMatrix4fv(program.cameraOffsetUniform, false, cameraOffset);


var texture = gl.createTexture();
var textureBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

var textureSrc = new Image();

textureSrc.addEventListener('load', function(){

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureSrc);
    gl.generateMipmap(gl.TEXTURE_2D);

    drawScene();


}, false);

textureSrc.src = '/img/uv-map.jpg';


function drawScene(){

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(program.textureCoordinates, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(program.uSampler, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);

    gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_SHORT, 0);

}