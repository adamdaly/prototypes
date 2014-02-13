
// set the scene size
var WIDTH = 400,
HEIGHT = 400;

// set some camera attributes
var VIEW_ANGLE = 45,
ASPECT = WIDTH / HEIGHT,
NEAR = 0.1,
FAR = 10000;

// get the DOM element to attach to
// - assume we've got jQuery to hand
var $container = $('#container');

// create a WebGL renderer, camera
// and a scene
var renderer = new THREE.WebGLRenderer();
var camera =
new THREE.PerspectiveCamera(
VIEW_ANGLE,
ASPECT,
NEAR,
FAR);

var scene = new THREE.Scene();

camera.position.z = 300;
// add the camera to the scene


// the camera starts at 0,0,0
// so pull it back

// start the renderer
renderer.setSize(WIDTH, HEIGHT);

// attach the render-supplied DOM element
$container.append(renderer.domElement);

// var sphereMaterial = new THREE.MeshLambertMaterial({
//     color: 0xCC0000
// });

var vertexShader = document.getElementById('vertex-shader').textContent,
    fragmentShader = document.getElementById('fragment-shader').textContent,
    attributes = {
        displacement: {
            type: 'f',
            value: []
        }
    },
    uniforms = {
        amplitude: {
            type: 'f',
            value: 0
        }
    };


var sphereMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    attributes: attributes,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
});

mesh = new THREE.Mesh(new THREE.SphereGeometry(50, 16, 16), sphereMaterial);

var verts = mesh.geometry.vertices;

for(var i = 0; i < verts.length; i++){
    attributes.displacement.value.push(Math.random() * 10);
}
// var pointLight = new THREE.PointLight(0xFFFFFF);

// set its position
// pointLight.position.x = 10;
// pointLight.position.y = 50;
// pointLight.position.z = 130;

scene.add(camera);
// scene.add(pointLight);
scene.add(mesh);

//clock = new THREE.Clock();
//clock.autoStart;

function tick(){
    renderer.render(scene, camera);

    //requestAnimationFrame(tick);
}

tick();