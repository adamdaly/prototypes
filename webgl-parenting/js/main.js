function logGLCall(functionName, args) {   
   console.log("gl." + functionName + "(" + WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");   
} 

var stage = document.getElementById('stage'),
    gl = stage.getContext('webgl');

gl.enable(gl.DEPTH_TEST);

// gl = WebGLDebugUtils.makeDebugContext(gl, undefined, logGLCall);

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

        gl.viewport(0, 0, stage.width, stage.height);

        mat4.perspective(this.pMatrix, 120, stage.width / stage.height, 0.1, 100.0);

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
            faces = [];

        for(var i in lines){
            if(lines[i].indexOf('v') === 0){
                vertexInfo.push(lines[i]);
            }else if(lines[i].indexOf('f') === 0){
                faceInfo.push(lines[i]);
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
                faces.push(splat[m] - 1);
            }
        }

        this.mesh.vertices = vertices;
        this.mesh.faces = faces;

        // this.mesh.vertices = [
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
            uniforms: ['mat4', 'MVMatrix', 'mat4', 'PMatrix'],
            varyings: ['vec3', 'TexCoord']
        }
        var vertexShaderFunction = 'vTexCoord = aVertexPosition + 0.5; gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1);';
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
        gl.enableVertexAttribArray(this.program.vertexPosAttrib);
        gl.vertexAttribPointer(this.program.vertexPosAttrib, this.itemSize, gl.FLOAT, false, 0, 0);

        this.program.mvMatrixUniform = gl.getUniformLocation(this.program, "uMVMatrix");
        this.program.pMatrixUniform = gl.getUniformLocation(this.program, "uPMatrix");


        scene.add(this);
    }
}

var geebee = new Mesh(scene, 'geebee');
var geebee = new Mesh(scene, 'geebee');

var initialTime = new Date().getTime();

function render(){

    currentTime = new Date().getTime();
    deltaTime = (currentTime - initialTime) / 1000; // in seconds

    // gl.viewport(0, 0, stage.width, stage.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for(var i in scene.meshes){

        mat4.translate(scene.meshes[i].mvMatrix, scene.meshes[i].mvMatrix, [0, 2, -10 - (10 * i)]);
        mat4.rotate(scene.meshes[i].mvMatrix, scene.meshes[i].mvMatrix, (45 * (Math.PI / 180)), [0, 1, 0]);

        gl.useProgram(scene.meshes[i].program);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, scene.meshes[i].buffers.vertexIndex);

        gl.uniformMatrix4fv(scene.meshes[i].program.mvMatrixUniform, gl.FALSE, scene.meshes[i].mvMatrix);
        gl.uniformMatrix4fv(scene.meshes[i].program.pMatrixUniform, gl.FALSE, scene.pMatrix);
        
        gl.drawElements(gl.TRIANGLES, scene.meshes[i].numItems, gl.UNSIGNED_SHORT, 0);
    }

    // requestAnimationFrame(render);
    // setTimeout(render, 1000);
}


// var offset = [1, 1];

// var initialTime = new Date().getTime(), 
//     deltaTime,
//     currentTime;



// var mvMatrix = mat4.create(),
//     pMatrix = mat4.create();


// var program,
//     vertexPositionBuffer,
//     vertexIndexBuffer,
//     transform = mat4.create(),
//     rotation = mat4.create(),
//     translate = mat4.create();

// function buildScene(obj){

//     // cube
//     // var vertices = [
//     //     // Front face
//     //     -1.0, -1.0,  1.0,
//     //      1.0, -1.0,  1.0,
//     //      1.0,  1.0,  1.0,
//     //     -1.0,  1.0,  1.0,
        
//     //     // Back face
//     //     -1.0, -1.0, -1.0,
//     //     -1.0,  1.0, -1.0,
//     //      1.0,  1.0, -1.0,
//     //      1.0, -1.0, -1.0,
        
//     //     // Top face
//     //     -1.0,  1.0, -1.0,
//     //     -1.0,  1.0,  1.0,
//     //      1.0,  1.0,  1.0,
//     //      1.0,  1.0, -1.0,
        
//     //     // Bottom face
//     //     -1.0, -1.0, -1.0,
//     //      1.0, -1.0, -1.0,
//     //      1.0, -1.0,  1.0,
//     //     -1.0, -1.0,  1.0,
        
//     //     // Right face
//     //      1.0, -1.0, -1.0,
//     //      1.0,  1.0, -1.0,
//     //      1.0,  1.0,  1.0,
//     //      1.0, -1.0,  1.0,
        
//     //     // Left face
//     //     -1.0, -1.0, -1.0,
//     //     -1.0, -1.0,  1.0,
//     //     -1.0,  1.0,  1.0,
//     //     -1.0,  1.0, -1.0
//     // ];


//     // pyramid
//     // var vertices = [
//     //     0.0, 1.0, 0.0,
//     //     1.0, -1.0, 1.0,
//     //     1.0, -1.0, -1.0,

//     //     0.0, 1.0, 0.0,
//     //     1.0, -1.0, -1.0,
//     //     -1.0, -1.0, -1.0,

//     //     0.0, 1.0, 0.0,
//     //     -1.0, -1.0, -1.0,
//     //     -1.0, -1.0, 1.0,

//     //     0.0, 1.0, 0.0, 
//     //     -1.0, -1.0, 1.0, 
//     //     1.0, -1.0, 1.0,

//     //     1.0, -1.0, 1.0, 
//     //     1.0, -1.0, -1.0, 
//     //     -1.0, -1.0, -1.0, 

//     //     -1.0, -1.0, -1.0, 
//     //     -1.0, -1.0, 1.0, 
//     //     1.0, -1.0, 1.0
//     // ];

//     // var vertices = obj.vertices;

//     vertexPositionBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.vertices), gl.STATIC_DRAW);

//     vertexPositionBuffer.itemSize = 3;
//     vertexPositionBuffer.numItems = obj.vertices.length / 3;

//     var vshaderInput = document.getElementById('v-shader').textContent,
//         fshaderInput = document.getElementById('f-shader').textContent;

//     program = gl.createProgram();

//     var vshader = gl.createShader(gl.VERTEX_SHADER);
//     gl.shaderSource(vshader, vshaderInput);
//     gl.compileShader(vshader);

//     var fshader = gl.createShader(gl.FRAGMENT_SHADER);
//     gl.shaderSource(fshader, fshaderInput);
//     gl.compileShader(fshader);

//     gl.attachShader(program, vshader);
//     gl.attachShader(program, fshader);
//     gl.linkProgram(program);

//     gl.useProgram(program);

//     program.vertexPosAttrib = gl.getAttribLocation(program, 'aVertexPosition');
//     gl.enableVertexAttribArray(program.vertexPosAttrib);
//     gl.vertexAttribPointer(program.vertexPosAttrib, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

//     program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
//     program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");

//     gl.viewport(0, 0, stage.width, stage.height);

//     // gl.clearColor(0, 0, 0, 1);
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//     mat4.perspective(pMatrix, 120, stage.width / stage.height, 0.1, 100.0);
//     mat4.identity(mvMatrix);

//     mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -10.0]);


//     gl.uniformMatrix4fv(program.pMatrixUniform, gl.FALSE, pMatrix);
//     gl.uniformMatrix4fv(program.mvMatrixUniform, gl.FALSE, mvMatrix);

//     vertexIndexBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);

//     var vertexIndices = obj.faces;

//     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
    
//     vertexIndexBuffer.itemSize = 1;
//     vertexIndexBuffer.numItems = vertexIndices.length;

//     gl.drawElements(gl.TRIANGLES, vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

//     tick();
// }


// var heading = [],
//     bank = [],
//     pitch = [],
//     isClockwise = false,
//     isAntiClockwise = false;

// window.addEventListener('keydown', function(e){

//     if(e.keyCode == 37){
//         if(bank.indexOf('anticlockwise') === -1){
//             bank.push('anticlockwise');
//         }

//     }else if(e.keyCode == 38){
//         if(pitch.indexOf('negative') === -1){
//             pitch.push('negative');
//         }
//         acceleration = 1;

//     }else if(e.keyCode == 39){
//         if(bank.indexOf('clockwise') === -1){
//             bank.push('clockwise');
//         }

//     }else if(e.keyCode == 40){
//         if(pitch.indexOf('positive') === -1){
//             pitch.push('positive');
//         }

//     }else if(e.keyCode == 88){
//         if(heading.indexOf('right') === -1){
//             heading.push('right');
//         }
//     }else if(e.keyCode == 90){
//         if(heading.indexOf('left') === -1){
//             heading.push('left');
//         }
//     }

// }, false);

// window.addEventListener('keyup', function(e){

//     if(e.keyCode == 37){
//         bank.splice(bank.indexOf('anticlockwise'), 1);

//     }else if(e.keyCode == 38){
//         pitch.splice(pitch.indexOf('negative'), 1);

//     }else if(e.keyCode == 39){
//         bank.splice(bank.indexOf('clockwise'), 1);

//     }else if(e.keyCode == 40){
//         pitch.splice(pitch.indexOf('positive'), 1);

//     }else if(e.keyCode == 88){
//         heading.splice(heading.indexOf('right'), 1);

//     }else if(e.keyCode == 90){
//         heading.splice(heading.indexOf('left'), 1);

//     }
// }, false);


// function tick(){

//     currentTime = new Date().getTime();
//     deltaTime = (currentTime - initialTime) / 1000; // in seconds

//     gl.clear(gl.COLOR_BUFFER_BIT);

//     mat4.identity(rotation);


//     if(heading.length){

//         if(heading[heading.length - 1] === 'left'){
//             mat4.rotate(rotation, rotation, 1 * (Math.PI / 180), [0, 1, 0]);
//         }else{
//             mat4.rotate(rotation, rotation, -1 * (Math.PI / 180), [0, 1, 0]);
//         }
        
//     }
//     if(pitch.length){

//         if(pitch[pitch.length - 1] === 'positive'){
//             mat4.rotate(rotation, rotation, 1 * (Math.PI / 180), [1, 0, 0]);
//         }else{
//             mat4.rotate(rotation, rotation, -1 * (Math.PI / 180), [1, 0, 0]);
//         }
        
//     }
//     if(bank.length){

//         if(bank[bank.length - 1] === 'anticlockwise'){
//             mat4.rotate(rotation, rotation, 1 * (Math.PI / 180), [0, 0, 1]);
//         }else{
//             mat4.rotate(rotation, rotation, -1 * (Math.PI / 180), [0, 0, 1]);
//         }
//     }

//     mat4.identity(translate);
//     mat4.translate(translate, translate, [0.0, 0.0, -0.01]);

//     mat4.identity(transform);
//     mat4.multiply(transform, rotation, translate);

//     mat4.multiply(mvMatrix, mvMatrix, transform);

//     gl.uniformMatrix4fv(program.mvMatrixUniform, gl.FALSE, mvMatrix);

//     // gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPositionBuffer.numItems);
//     gl.drawElements(gl.TRIANGLES, vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

//     requestAnimationFrame(tick);
// }