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
        splat,
        obj = {},
        vertexInfo = [],
        vertices = [],
        faceInfo = [],
        faces = [],
        textureInfo = [],
        textureVertex = [],
        textureIndicies = [],
        textureCoordinates = [];

    for(var i0 in lines){
        if(lines[i0].indexOf('v ') === 0){
            vertexInfo.push(lines[i0]);
        }else if(lines[i0].indexOf('f ') === 0){
            faceInfo.push(lines[i0]);
        }else if(lines[i0].indexOf('vt') === 0){
            textureInfo.push(lines[i0]);
        }
    }

    for(var i1 in vertexInfo){
        splat = vertexInfo[i1].split(' ');
        for(var i2 = 1; i2 < splat.length; i2++){
            vertices.push(splat[i2]);
        }
    }

    for(var i3 in textureInfo){
        splat = textureInfo[i3].split(' ');
        for(var i4 = 1; i4 < splat.length; i4++){
            textureVertex.push(splat[i4]);
        }
    }

    for(var i5 in faceInfo){
        var splat = faceInfo[i5].split(' ');
        for(var i6 = 1; i6 < splat.length; i6++){

            var sploot = splat[i6].split('/');
            faces.push(sploot[0] - 1);
            textureCoordinates[parseInt(sploot[0] - 1) * 2] = textureVertex[parseInt(sploot[1] - 1) * 2];// x
            textureCoordinates[parseInt(sploot[0] - 1) * 2 + 1] = textureVertex[parseInt(sploot[1] - 1) * 2 + 1];// y
        }
    }

    // for(var n in textureInfo){
    //     var splat = textureInfo[n].split(' ');

    //     textureVertex.push([splat[1], splat[2]]);

    // }

    // for(var o in textureIndicies){
    //     textureCoordinates = textureCoordinates.concat(textureVertex[textureIndicies[o]]);
    // }

    obj.vertices = vertices;
    obj.faces = faces;
    obj.textureCoordinates = textureCoordinates;

    test = obj;
    return obj;
}

var request = new XMLHttpRequest(), response;
request.open('GET', '/js/models/geebee.obj');


request.onreadystatechange = function(){
    if(request.readyState === 4){
        buildScene(parseResponse(request.responseText));
    }
}

request.send();

var program,
    vertexPositionBuffer,
    vertexIndexBuffer,
    texture,
    textureBuffer,
    transform = mat4.create(),
    rotation = mat4.create(),
    translate = mat4.create();

function buildScene(obj){

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
    // gl.vertexAttribPointer(program.vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);


    program.textureCoordinates = gl.getAttribLocation(program, 'aTextureCoordinates');
    gl.enableVertexAttribArray(program.textureCoordinates);
    // gl.vertexAttribPointer(program.textureCoordinates, 2, gl.FLOAT, false, 0, 0);

    program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
    program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
    program.textureSampler = gl.getUniformLocation(program, 'uSampler');

    gl.viewport(0, 0, stage.width, stage.height);

    // gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(pMatrix, 120, stage.width / stage.height, 0.1, 100.0);
    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -10.0]);


    gl.uniformMatrix4fv(program.pMatrixUniform, gl.FALSE, pMatrix);
    gl.uniformMatrix4fv(program.mvMatrixUniform, gl.FALSE, mvMatrix);

    vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(obj.faces), gl.STATIC_DRAW);
    
    vertexIndexBuffer.itemSize = 1;
    vertexIndexBuffer.numItems = obj.faces.length;

    texture = gl.createTexture();

    textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.textureCoordinates), gl.STATIC_DRAW);

    var textureSrc = new Image();

    textureSrc.addEventListener('load', function(){
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureSrc);
        gl.generateMipmap(gl.TEXTURE_2D);

        tick();
    }, false);

    textureSrc.src = '/img/geebee-diffuse.png';
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
    mat4.translate(translate, translate, [0.0, 0.0, -0.05]);

    mat4.identity(transform);
    mat4.multiply(transform, rotation, translate);

    mat4.multiply(mvMatrix, mvMatrix, transform);


    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(program.textureCoordinates, 2, gl.FLOAT, false, 0, 0);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(program.uSampler, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);


    gl.uniformMatrix4fv(program.mvMatrixUniform, gl.FALSE, mvMatrix);

    gl.drawElements(gl.TRIANGLES, vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(tick);
}