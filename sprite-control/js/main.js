var stage = document.getElementById('stage'),
	context = stage.getContext('2d');

stage.width = 600;
stage.height = 600;

function Sprite(name, image){
	this.padding = 20;
	this.name = name;
	this.image = image;
	this.width = image.width;
	this.height = image.height;
	this.position = {
		x: 0
		, y: 0
	};
	this.bounds = Math.max(this.width, this.height);
	this.canvas = document.createElement('canvas');
	this.context = this.canvas.getContext('2d');
	this.canvas.width = this.bounds + this.padding;
	this.canvas.height = this.bounds + this.padding;

	this.context.drawImage(this.image, this.padding / 2, this.padding / 2, this.width, this.height);
	this.init();
}

Sprite.prototype = {
	init: function(){
	}
}

var spaceshipImage = new Image(),
	spaceship;

spaceshipImage.onload = function(){
	spaceship = new Sprite('spaceship', spaceshipImage);

	tick();
}

spaceshipImage.src = 'img/spaceship.png';

var isAccelerate = false,
    acceleration = 0,
    kDrag = 0.1,
    velocity = {
    	x: 0
    	, y: 0
    },
    drag = {
    	x: 0
    	, y: 0
    },
    deltaTime = 0,
    initialTime = new Date().getTime(),
    density = 0.01,
    area = 0.1,
	angle = 0,
	direction = [],
	AngularDirection = [],
	translate = {
		x: 0
		, y: 0
	},
	isForward = false,
	isBack = false,
	isClockwise = false,
	isAntiClockwise = false;


window.addEventListener('keydown', function(e){

	if(e.keyCode == 37){
		isAntiClockwise = true;
		if(AngularDirection.indexOf('anticlockwise') === -1){
			AngularDirection.push('anticlockwise');
		}

	}else if(e.keyCode == 38){
		isForward = true;
		if(direction.indexOf('forwards') === -1){
			direction.push('forwards');
		}
		acceleration = 1;

	}else if(e.keyCode == 39){
		isClockwise = true;
		if(AngularDirection.indexOf('clockwise') === -1){
			AngularDirection.push('clockwise');
		}

	}else if(e.keyCode == 40){
		isBack = true;
		if(direction.indexOf('backwards') === -1){
			direction.push('backwards');
		}

	}
}, false);

window.addEventListener('keyup', function(e){

	if(e.keyCode == 37){
		isAntiClockwise = false;
		AngularDirection.splice(AngularDirection.indexOf('anticlockwise'), 1);

	}else if(e.keyCode == 38){
		isForward = false;
		direction.splice(direction.indexOf('forwards'), 1);
		acceleration = 0;

	}else if(e.keyCode == 39){
		isClockwise = false;
		AngularDirection.splice(AngularDirection.indexOf('clockwise'), 1);

	}else if(e.keyCode == 40){
		isBack = false;
		direction.splice(direction.indexOf('backwards'), 1);

	}
}, false);


utilities = {

	toRadian: function(degree){
		return degree * (Math.PI / 180);
	}
	, toDegree: function(radian){
		return degree * (180 / Math.PI);
	}
}

var output = document.getElementById('output');

function tick(){
    
	if(!!AngularDirection.length){

		AngularDirection[AngularDirection.length - 1] === 'clockwise' ?  angle += 4 : angle -= 4;
		spaceship.context.clearRect(0, 0, spaceship.bounds + spaceship.padding, spaceship.bounds + spaceship.padding);
		spaceship.context.save();
		spaceship.context.translate((spaceship.bounds / 2) + (spaceship.padding / 2), (spaceship.bounds / 2) + (spaceship.padding / 2));
		spaceship.context.rotate(utilities.toRadian(angle));
		spaceship.context.drawImage(spaceship.image, -spaceship.bounds / 2, -spaceship.bounds / 2, spaceship.width, spaceship.height);
		spaceship.context.restore();
	}

	currentTime = new Date().getTime();
    deltaTime = currentTime - initialTime;
    initialTime = currentTime;
        
    velocity.x += (acceleration * Math.sin(utilities.toRadian(angle))) * deltaTime;
    velocity.y += (acceleration * Math.cos(utilities.toRadian(angle))) * deltaTime;

    drag.x = Math.abs((density * Math.pow(velocity.x, 2) * kDrag * area) / 2);
    drag.y = Math.abs((density * Math.pow(velocity.y, 2) * kDrag * area) / 2);

    output.innerText = 'x: ' + parseInt(velocity.x) + ' y: ' + parseInt(velocity.y) + ' drag: ' + parseInt(drag);
    
    (velocity.x < 0) ? velocity.x += drag.x : velocity.x -= drag.x;
    (velocity.y < 0) ? velocity.y += drag.y : velocity.y -= drag.y;

    if(spaceship.position.x > 600){
    	spaceship.position.x -= 600;
    }else if(spaceship.position.x < 0){
    	spaceship.position.x += 600;
    }

    if(spaceship.position.y > 600){
    	spaceship.position.y -= 600;
    }else if(spaceship.position.y < 0){
    	spaceship.position.y += 600;
    }
    

	context.clearRect(0, 0, 600, 600);
	context.drawImage(spaceship.canvas, spaceship.position.x += -(velocity.x / 50), spaceship.position.y += (velocity.y / 50), spaceship.canvas.width, spaceship.canvas.height);

	webkitRequestAnimationFrame(tick);
}
