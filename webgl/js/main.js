function logGLCall(functionName, args) {   
   console.log("gl." + functionName + "(" + WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");   
} 

var stage = document.getElementById('stage'),
    gl = stage.getContext('webgl');

gl.enable(gl.DEPTH_TEST);

// gl = WebGLDebugUtils.makeDebugContext(gl, undefined, logGLCall);

var offset = [1, 1];

var initialTime = new Date().getTime(), 
    deltaTime,
    currentTime;



var mvMatrix = mat4.create(),
    pMatrix = mat4.create();

var test;

function parseResponse(response){
    var lines = response.split('\n'),
        obj = {},
        vertexInfo = [],
        vertices = [],
        faceInfo = [],
        faces = [],
        textureInfo = [],
        textureIndicies = [],
        textureCoordinates = [];

    for(var i in lines){
        if(lines[i].indexOf('v ') === 0){
            vertexInfo.push(lines[i]);
        }else if(lines[i].indexOf('f ') === 0){
            faceInfo.push(lines[i]);
        }else if(lines[i].indexOf('vt') === 0){
            textureInfo.push(lines[i]);
        }
    }

    for(var j in vertexInfo){
        var splat = vertexInfo[j].split(' ');
        for(var k = 1; k < splat.length; k++){
            vertices.push(splat[k]);
        }
    }

    for(var l in faceInfo){
        var splat = faceInfo[l].split(' ');
        for(var m = 1; m < splat.length; m++){

            var sploot = splat[m].split('/');
            faces.push(sploot[0] - 1);
            textureIndicies.push(sploot[1] - 1);
        }
    }

    for(var n in textureInfo){
        var splat = textureInfo[n].split(' ');
        for(var o = 1; o < splat.length; o++){
            textureCoordinates.push(splat[o]);
        }
    }

    obj.vertices = vertices;
    obj.faces = faces;
    obj.textureIndicies = textureIndicies;
    obj.textureCoordinates = textureCoordinates;

    return obj;
}

var request = new XMLHttpRequest(), response;
request.open('GET', '/js/models/cube2.obj');


request.onreadystatechange = function(){
    if(request.readyState === 4){
        buildScene(parseResponse(request.responseText));
        // buildScene(JSON.parse(request.responseText));
    }
}

request.send();

var program,
    vertexPositionBuffer,
    vertexIndexBuffer,
    transform = mat4.create(),
    rotation = mat4.create(),
    translate = mat4.create();

function buildScene(obj){

    // cube
    // var vertices = [
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
    //     -1.0,  1.0, -1.0
    // ];


    // pyramid
    // var vertices = [
    //     0.0, 1.0, 0.0,
    //     1.0, -1.0, 1.0,
    //     1.0, -1.0, -1.0,

    //     0.0, 1.0, 0.0,
    //     1.0, -1.0, -1.0,
    //     -1.0, -1.0, -1.0,

    //     0.0, 1.0, 0.0,
    //     -1.0, -1.0, -1.0,
    //     -1.0, -1.0, 1.0,

    //     0.0, 1.0, 0.0, 
    //     -1.0, -1.0, 1.0, 
    //     1.0, -1.0, 1.0,

    //     1.0, -1.0, 1.0, 
    //     1.0, -1.0, -1.0, 
    //     -1.0, -1.0, -1.0, 

    //     -1.0, -1.0, -1.0, 
    //     -1.0, -1.0, 1.0, 
    //     1.0, -1.0, 1.0
    // ];

    // obj.vertices = vertices;

    vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.vertices), gl.STATIC_DRAW);

    vertexPositionBuffer.itemSize = 3;
    vertexPositionBuffer.numItems = obj.vertices.length / 3;

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
    gl.vertexAttribPointer(program.vertexPosAttrib, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    program.textureCoordAttribute = gl.getAttribLocation(program, 'aTextureCoordinates');
    gl.enableVertexAttribArray(program.textureCoordAttribute);
    gl.vertexAttribPointer(program.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
    program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");

    gl.viewport(0, 0, stage.width, stage.height);

    mat4.perspective(pMatrix, 120, stage.width / stage.height, 0.1, 100.0);
    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -10.0]);


    gl.uniformMatrix4fv(program.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(program.mvMatrixUniform, false, mvMatrix);

    vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);

    var vertexIndices = obj.faces;

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
    
    vertexIndexBuffer.itemSize = 1;
    vertexIndexBuffer.numItems = vertexIndices.length;


    //##################### TEXTURE

    var texture = gl.createTexture();
    var textureCoordinatesBuffer = gl.createBuffer();

    textureSrc = new Image();
    textureSrc.onload = function(){

        gl.activeTexture(gl.TEXTURE0);
        
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureSrc);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinatesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.textureCoordinates), gl.STATIC_DRAW);

        gl.vertexAttribPointer(program.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

        // var textureIndiciesBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, textureIndiciesBuffer);
        // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(obj.textureIndicies), gl.STATIC_DRAW);

        gl.uniform1i(gl.getUniformLocation(program, "uSampler"), 0);

        tick();

    }

    textureSrc.src = '/img/cube-diffuse.png';

}


var heading = [],
    bank = [],
    pitch = [];

window.addEventListener('keydown', function(e){

    if(e.keyCode == 37){
        if(bank.indexOf('anticlockwise') === -1){
            bank.push('anticlockwise');
        }

    }else if(e.keyCode == 38){
        if(pitch.indexOf('negative') === -1){
            pitch.push('negative');
        }
        acceleration = 1;

    }else if(e.keyCode == 39){
        if(bank.indexOf('clockwise') === -1){
            bank.push('clockwise');
        }

    }else if(e.keyCode == 40){
        if(pitch.indexOf('positive') === -1){
            pitch.push('positive');
        }

    }else if(e.keyCode == 88){
        if(heading.indexOf('right') === -1){
            heading.push('right');
        }
    }else if(e.keyCode == 90){
        if(heading.indexOf('left') === -1){
            heading.push('left');
        }
    }

}, false);

window.addEventListener('keyup', function(e){

    if(e.keyCode == 37){
        bank.splice(bank.indexOf('anticlockwise'), 1);

    }else if(e.keyCode == 38){
        pitch.splice(pitch.indexOf('negative'), 1);

    }else if(e.keyCode == 39){
        bank.splice(bank.indexOf('clockwise'), 1);

    }else if(e.keyCode == 40){
        pitch.splice(pitch.indexOf('positive'), 1);

    }else if(e.keyCode == 88){
        heading.splice(heading.indexOf('right'), 1);

    }else if(e.keyCode == 90){
        heading.splice(heading.indexOf('left'), 1);

    }
}, false);


function tick(){

    currentTime = new Date().getTime();
    deltaTime = (currentTime - initialTime) / 1000; // in seconds

    gl.clear(gl.COLOR_BUFFER_BIT);

    mat4.identity(rotation);


    if(heading.length){

        if(heading[heading.length - 1] === 'left'){
            mat4.rotate(rotation, rotation, 1 * (Math.PI / 180), [0, 1, 0]);
        }else{
            mat4.rotate(rotation, rotation, -1 * (Math.PI / 180), [0, 1, 0]);
        }
        
    }
    if(pitch.length){

        if(pitch[pitch.length - 1] === 'positive'){
            mat4.rotate(rotation, rotation, 1 * (Math.PI / 180), [1, 0, 0]);
        }else{
            mat4.rotate(rotation, rotation, -1 * (Math.PI / 180), [1, 0, 0]);
        }
        
    }
    if(bank.length){

        if(bank[bank.length - 1] === 'anticlockwise'){
            mat4.rotate(rotation, rotation, 1 * (Math.PI / 180), [0, 0, 1]);
        }else{
            mat4.rotate(rotation, rotation, -1 * (Math.PI / 180), [0, 0, 1]);
        }
    }

    mat4.identity(translate);
    mat4.translate(translate, translate, [0.0, 0.0, -0.01]);

    mat4.identity(transform);
    mat4.multiply(transform, rotation, translate);

    mat4.multiply(mvMatrix, mvMatrix, transform);

    gl.uniformMatrix4fv(program.mvMatrixUniform, false, mvMatrix);

    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPositionBuffer.numItems);
    gl.drawElements(gl.TRIANGLES, vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(tick);
}