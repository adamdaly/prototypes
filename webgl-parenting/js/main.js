function logGLCall(functionName, args) {   
   console.log("gl." + functionName + "(" + WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");   
}



var stage = document.getElementById('stage'),
    gl = stage.getContext('webgl');

stage.width = window.innerWidth;
stage.height = window.innerHeight;

gl.enable(gl.DEPTH_TEST);

// gl = WebGLDebugUtils.makeDebugContext(gl, undefined, logGLCall);


window.addEventListener('resize', function(){

    stage.width = window.innerWidth;
    stage.height = window.innerHeight;

    mat4.perspective(scene.pMatrix, 120, stage.width / stage.height, 0.1, 100.0);

}, false);

var utils = {

    buildVertexShader: function(props, shaderFunction){
        var shader = '';

        for(var i = 0; i < props.attributes.length; i += 2){
            shader += 'attribute ' + props.attributes[i] + ' a' + props.attributes[i + 1] + ';';
        }

        shader += '';

        for(var j = 0; j < props.uniforms.length; j += 2){
            shader += 'uniform ' + props.uniforms[j] + ' u' + props.uniforms[j + 1] + ';';
        }

        shader += '';

        for(var k = 0; k < props.varyings.length; k += 2){
            shader += 'varying ' + props.varyings[k] + ' v' + props.varyings[k + 1] + ';';
        }

        shader += 'void main() {';

        shader += shaderFunction;

        shader += '}';
        return shader;
    }

    , buildFragmentShader: function(props, shaderFunction){
        var shader = 'precision mediump float;';

        for(var i = 0; i < props.attributes.length; i += 2){
            shader += 'attribute ' + props.attributes[i] + ' a' + props.attributes[i + 1] + ';';
        }

        shader += '';

        for(var j = 0; j < props.uniforms.length; j += 2){
            shader += 'uniform ' + props.uniforms[j] + ' u' + props.uniforms[j + 1] + ';';
        }

        shader += '';

        for(var k = 0; k < props.varyings.length; k += 2){
            shader += 'varying ' + props.varyings[k] + ' v' + props.varyings[k + 1] + ';';
        }

        shader += 'void main() {';

        shader += shaderFunction;

        shader += '}';
        return shader;
    }
}

function Scene(){
    this.meshes = [];
    this.init();
}

Scene.prototype = {
    init: function(){
        this.pMatrix = mat4.create();
        this.cameraOffset = mat4.create();

        mat4.perspective(this.pMatrix, 120, stage.width / stage.height, 0.1, 100.0);

        mat4.translate(this.cameraOffset, this.cameraOffset, [0, -4, -10]);

    }

    , add: function(mesh){
        this.meshes.push(mesh);
    }
};

var scene = new Scene();

function Mesh(scene, name){
    this.name = name;
    this.buffers = {};
    this.mesh = {};

    this.loadObject(this.name);
}

Mesh.prototype = {
    
    loadObject: function(name){
        var request = new XMLHttpRequest(),
            response,
            that = this;

        request.open('GET', '/js/models/' + name + '.obj');

        request.onreadystatechange = function(){

            if(request.readyState === 4){
                that.parseResponse(request.responseText);
            }
        }

        request.send();
    }
    , parseResponse: function(response){

        var lines = response.split('\n'),
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

        this.mesh.vertices = vertices;
        this.mesh.faces = faces;
        this.mesh.textureIndicies = textureIndicies;
        this.mesh.textureCoordinates = textureCoordinates;

        this.buildMeshData();

    }
    , buildMeshData: function(){

        this.mvMatrix = mat4.create();

        this.buffers.vertexPosition = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertexPosition);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), gl.STATIC_DRAW);

        this.buffers.vertexIndex = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.vertexIndex);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.mesh.faces), gl.STATIC_DRAW);

        this.itemSize = 3;
        this.numItems = this.mesh.faces.length;

        var vertexProps = {

            attributes: ['vec3', 'VertexPosition'],
            uniforms: ['mat4', 'MVMatrix', 'mat4', 'PMatrix', 'mat4', 'CameraOffset'],
            varyings: ['vec3', 'TexCoord']
        }
        var vertexShaderFunction = 'vTexCoord = aVertexPosition + 0.5; gl_Position = uPMatrix * uCameraOffset * uMVMatrix * vec4(aVertexPosition, 1);';
        var vshaderInput = utils.buildVertexShader(vertexProps, vertexShaderFunction);

        var fragmentProps = {

            attributes: [],
            uniforms: [],
            varyings: ['vec3', 'TexCoord']
        }
        var fragmentShaderFunction = 'gl_FragColor = vec4(vTexCoord, 1);';
        var fshaderInput = utils.buildFragmentShader(fragmentProps, fragmentShaderFunction);

        this.program = gl.createProgram();

        var vshader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vshader, vshaderInput);
        gl.compileShader(vshader);

        var fshader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fshader, fshaderInput);
        gl.compileShader(fshader);

        gl.attachShader(this.program, vshader);
        gl.attachShader(this.program, fshader);

        gl.linkProgram(this.program);

        this.program.vertexPosAttrib = gl.getAttribLocation(this.program, 'aVertexPosition');

        this.program.mvMatrixUniform = gl.getUniformLocation(this.program, "uMVMatrix");
        this.program.pMatrixUniform = gl.getUniformLocation(this.program, "uPMatrix");
        this.program.cameraOffset = gl.getUniformLocation(this.program, "uCameraOffset");

        scene.add(this);
    }
}

// var propeller = new Mesh(scene, 'propeller');
// var geebee = new Mesh(scene, 'geebee');
// var ground = new Mesh(scene, 'ground');
// var cube = new Mesh(scene, 'cube');
var cube2 = new Mesh(scene, 'cube2');

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


    


var initialTime = new Date().getTime();
var geebeeTransform = mat4.create(),
    geebeeTranslate = mat4.create(),
    geebeeRotation = mat4.create(),
    propellerTransform = mat4.create(),
    propellerTranslate = mat4.create(),
    propellerRotation = mat4.create(),
    propellerAngularVelocity = 0,
    groundTranslate = mat4.create(),
    cameraTransform = mat4.create(),
    cameraTranslate = mat4.create(),
    cameraRotation = mat4.create();

mat4.translate(groundTranslate, groundTranslate, [0, -10, 0]);

function render(){

    currentTime = new Date().getTime();
    deltaTime = (currentTime - initialTime) / 1000; // in seconds

    gl.viewport(0, 0, stage.width, stage.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    mat4.identity(geebeeRotation);

    if(heading.length){

        if(heading[heading.length - 1] === 'left'){
            mat4.rotate(geebeeRotation, geebeeRotation, 1 * (Math.PI / 180), [0, 1, 0]);
        }else{
            mat4.rotate(geebeeRotation, geebeeRotation, -1 * (Math.PI / 180), [0, 1, 0]);
        }
    }
    if(pitch.length){

        if(pitch[pitch.length - 1] === 'positive'){
            mat4.rotate(geebeeRotation, geebeeRotation, 1 * (Math.PI / 180), [1, 0, 0]);
        }else{
            mat4.rotate(geebeeRotation, geebeeRotation, -1 * (Math.PI / 180), [1, 0, 0]);
        }
    }
    if(bank.length){

        if(bank[bank.length - 1] === 'anticlockwise'){
            mat4.rotate(geebeeRotation, geebeeRotation, 1 * (Math.PI / 180), [0, 0, 1]);
        }else{
            mat4.rotate(geebeeRotation, geebeeRotation, -1 * (Math.PI / 180), [0, 0, 1]);
        }
    }

    // propellerAngularVelocity += 2;

    // mat4.identity(geebeeTranslate);
    // mat4.translate(geebeeTranslate, geebeeTranslate, [0.0, 0.0, -0.05]);
    // mat4.identity(geebeeTransform);
    // mat4.multiply(geebeeTransform, geebeeRotation, geebeeTranslate);
    // mat4.multiply(geebee.mvMatrix, geebee.mvMatrix, geebeeTransform);

    // mat4.identity(propeller.mvMatrix);
    // mat4.identity(propellerTranslate);
    // mat4.identity(propellerRotation);
    // mat4.rotateZ(propellerRotation, propellerRotation, propellerAngularVelocity * (Math.PI / 180));
    // mat4.translate(propellerTranslate, propellerTranslate, [0, 0, -3.0]);
    // mat4.multiply(propellerTransform, propellerRotation, propellerTranslate);
    // mat4.multiply(propellerTransform, geebee.mvMatrix, propellerTransform);
    // mat4.multiply(propeller.mvMatrix, propeller.mvMatrix, propellerTransform);

    // mat4.identity(scene.cameraOffset);
    // mat4.identity(cameraTranslate);
    // mat4.identity(cameraTransform);
    // mat4.translate(cameraTranslate, cameraTranslate, [0, 2.0, 10.0]);
    // mat4.multiply(cameraTransform, cameraTransform, cameraTranslate);
    // mat4.multiply(cameraTransform, geebee.mvMatrix, cameraTransform);
    // mat4.multiply(scene.cameraOffset, scene.cameraOffset, cameraTransform);

    // mat4.invert(scene.cameraOffset, scene.cameraOffset);

    // ground.mvMatrix.set(groundTranslate);


    for(var i in scene.meshes){
        mat4.identity(scene.meshes[i].mvMatrix);
        mat4.translate(scene.meshes[i].mvMatrix, scene.meshes[i].mvMatrix, [0.0, (2.0 * i), -10]);

        gl.useProgram(scene.meshes[i].program);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, scene.meshes[i].buffers.vertexPosition);
        gl.vertexAttribPointer(scene.meshes[i].program.vertexPosAttrib, scene.meshes[i].itemSize, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(scene.meshes[i].program.vertexPosAttrib);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, scene.meshes[i].buffers.vertexIndex);

        gl.uniformMatrix4fv(scene.meshes[i].program.mvMatrixUniform, false, scene.meshes[i].mvMatrix);
        gl.uniformMatrix4fv(scene.meshes[i].program.pMatrixUniform, false, scene.pMatrix);
        gl.uniformMatrix4fv(scene.meshes[i].program.cameraOffset, false, scene.cameraOffset);
        
        gl.drawElements(gl.TRIANGLES, scene.meshes[i].numItems, gl.UNSIGNED_SHORT, 0);

        gl.disableVertexAttribArray(scene.meshes[i].program.vertexPosAttrib);

    }

    requestAnimationFrame(render);
}
