var stage = document.getElementById('stage'),
    context = stage.getContext('2d');

stage.width = 600;
stage.height = 600;

function Missile(){

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.canvas.width = 2;
    this.canvas.height = 10;
    this.x = 0;
    this.y = 0;
    this.rotation = 0;

    this.context.fillStyle = '#FF0000'
    this.context.fillRect(0, 0, 2, 10);
}

var missile = new Missile();

function Prey(){

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.canvas.width = 10;
    this.canvas.height = 10;
    this.x = Math.random() * 600;
    this.y = Math.random() * 600;

    this.context.fillStyle = '#0000FF';
    this.context.fillRect(0, 0, 10, 10);
}

var prey = new Prey();

var offset = {
    x: 0,
    y: 0
},  angle;

var initialTime = new Date().getTime();

var output = document.getElementById('output');

var tick = function(){

    currentTime = new Date().getTime();
    deltaTime = currentTime - initialTime;
    initialTime = currentTime;

    offset.x = prey.x - missile.x;
    offset.y = prey.y - missile.y;

    angle = Math.atan(offset.y / offset.x);

    output.innerText = Math.sin(angle).toFixed(1) + ' ' + Math.cos(angle).toFixed(1);//angle.toFixed(2) * (180 / Math.PI);

    context.clearRect(0, 0, 600, 600);
    context.drawImage(missile.canvas, missile.x, missile.y, 2, 10);
    context.drawImage(prey.canvas, prey.x, prey.y, 10, 10);

    missile.y += 1;

    webkitRequestAnimationFrame(tick);
}

tick();
