// (function(){
// 	var stage = document.getElementById('stage'),
// 		context = stage.getContext('2d'),
// 		collisionCanvas = document.createElement('canvas'),
// 		collisionContext = collisionCanvas.getContext('2d'),
// 		collisionData;

// 	document.getElementsByTagName('body')[0].appendChild(collisionCanvas);

// 	stage.width = 400;
// 	stage.height = 400;

// 	var cast = {};

// 	var Sprite = function(name, image, x, y){
// 		this.name = name;
// 		this.image = image;
// 		this.x = x;
// 		this.y = y;
// 		this.width = image.width;
// 		this.height = image.height;

// 		this.init();
// 	}

// 	Sprite.prototype = {
// 		init: function(){
// 			console.log(this);
// 			this.canvas = document.createElement('canvas');
// 			this.context = this.canvas.getContext('2d');
// 			this.canvas.width = this.width;
// 			this.canvas.height = this.height;

// 			this.context.drawImage(this.image, 0, 0);

// 			cast[this.name] = this;

// 			// context.drawImage(this.canvas, this.x, this.y, this.width, this.height);
// 		}
// 	};

// 	var playerImage = new Image(),
// 		player;

// 	playerImage.onload = function(){
// 		player = new Sprite('player', playerImage, 0, 0);
// 	}

// 	playerImage.src = 'img/shape-1.png';

// 	var obstacleImage = new Image(),
// 		obstacle;

// 	obstacleImage.onload = function(){
// 		obstacle = new Sprite('obstacle', obstacleImage, 100, 100);
// 	}

// 	obstacleImage.src = 'img/shape-2.png';

// 	var keysPressed = [];
// 	window.addEventListener('keydown', function(e){
// 		if(keysPressed.indexOf(e.keyCode) === -1){
// 			keysPressed.push(e.keyCode);
// 		}
// 	}, false);

// 	window.addEventListener('keyup', function(e){
// 		var index = keysPressed.indexOf(e.keyCode);
// 		keysPressed.splice(index, 1);
// 	}, false);

// 	function tick(){
// 		context.clearRect(0, 0, stage.width, stage.height);
// 		for(var i in cast){
// 			context.drawImage(cast[i].canvas, cast[i].x, cast[i].y, cast[i].width, cast[i].height);
// 			if(cast[i].name === 'player'){
// 				// console.log(
// 				// 	cast[i].name
// 				// 	, 'xmin = ' + cast[i].x
// 				// 	, 'xmax = ' + (cast[i].x + cast[i].width)
// 				// 	, 'ymin = ' + cast[i].y
// 				// 	, 'ymax = ' + (cast[i].y + cast[i].height)
// 				// );
// 			}
// 		}

// 		var aMin = {
// 			x: cast.player.x,
// 			y: cast.player.y
// 		};

// 		var aMax = {
// 			x: cast.player.x + cast.player.width,
// 			y: cast.player.y + cast.player.height
// 		};

// 		var bMin = {
// 			x: cast.obstacle.x,
// 			y: cast.obstacle.y
// 		};

// 		var bMax = {
// 			x: cast.obstacle.x + cast.obstacle.width,
// 			y: cast.obstacle.y + cast.obstacle.height
// 		};

// 		var boundingBox = {
// 			cMin_x: aMin.x > bMin.x ? aMin.x : bMin.x, // bMin.x : aMin.x
// 			cMin_y: aMin.y > bMin.y ? aMin.y : bMin.y,
// 			cMax_x: aMax.x < bMax.x ? aMax.x : bMax.x,
// 			cMax_y: aMax.y < bMax.y ? aMax.y : bMax.y
// 		}

// 		for(var key in keysPressed){
// 			keysPressed[key]

// 			var keyCode = keysPressed[key],
// 				keyCodes = {
// 					37: function(){
// 						cast.player.x -= 2
// 					}
// 					,38: function(){
// 						cast.player.y -= 2
// 					}
// 					,39: function(){
// 						cast.player.x += 2
// 					}
// 					,40: function(){
// 						cast.player.y += 2
// 					}
// 				}
// 			if(keyCodes.hasOwnProperty(keyCode)){
// 				keyCodes[keyCode].call();
// 			}
// 		}

// 		// ToDo: Implement Quadtree

// 		context.beginPath();
// 		context.moveTo(boundingBox.cMin_x, boundingBox.cMin_y);
// 		context.lineTo(boundingBox.cMax_x, boundingBox.cMin_y);
// 		context.lineTo(boundingBox.cMax_x, boundingBox.cMax_y);
// 		context.lineTo(boundingBox.cMin_x, boundingBox.cMax_y);
// 		context.lineTo(boundingBox.cMin_x, boundingBox.cMin_y);
// 		context.stroke();


// 		boundingBox.width = Math.abs(boundingBox.cMin_x - boundingBox.cMax_x);
// 		boundingBox.height = Math.abs(boundingBox.cMin_y - boundingBox.cMax_y);

// 		boundingBox.data = context.getImageData(boundingBox.cMin_x, boundingBox.cMin_y, (boundingBox.width === 0 ? 1 : boundingBox.width), (boundingBox.height === 0 ? 1 : boundingBox.height));

		
// 		collisionCanvas.width = boundingBox.width;
// 		collisionCanvas.height = boundingBox.height;
		
// 		player.collisionOffset = {
// 			x: boundingBox.cMin_x - player.x,
// 			y: boundingBox.cMin_y - player.y
// 		};

// 		obstacle.collisionOffset = {
// 			x: boundingBox.cMin_x - obstacle.x,
// 			y: boundingBox.cMin_y - obstacle.y
// 		}

// 		collisionContext.clearRect(0, 0, collisionCanvas.width, collisionCanvas.height);

// 		collisionContext.drawImage(obstacle.canvas, obstacle.collisionOffset.x, obstacle.collisionOffset.y, boundingBox.width, boundingBox.height, 0, 0, collisionCanvas.width, collisionCanvas.height);

// 		collisionContext.globalCompositeOperation = 'destination-in';

// 		collisionContext.drawImage(player.canvas, player.collisionOffset.x, player.collisionOffset.y, boundingBox.width, boundingBox.height, 0, 0, collisionCanvas.width, collisionCanvas.height);

// 		collisionData = collisionContext.getImageData(0, 0, collisionCanvas.width, collisionCanvas.height);

// 		for(var j = 3; j < collisionData.data.length; j += 4){
// 			if(collisionData.data[j] > 0){
// 				console.log('collision');
// 				break;
// 			}
// 		}

// 		setTimeout(function(){
// 			webkitRequestAnimationFrame(tick);
// 		}, 50);
// 	}

// 	tick();

// })();


// (function(){
    var stage = document.getElementById('stage'),
        context = stage.getContext('2d');
    
    stage.width = 400;
    stage.height = 400;
    
    var sprites = [];
    
    stage.addEventListener('click', function(e){
        sprites.push(new Sprite(e.offsetX, e.offsetY));
        quadtree.add(e.offsetX, e.offsetY);
    }, false);
    
    function Sprite(x, y){
        this.x = x;
        this.y = y;
        this.init();
    }
    
    Sprite.prototype = {
        init: function(){
            context.fillRect(this.x, this.y, 4, 4);
        }
    }

    for(var i = 0; i < 10; i++){
    	sprites.push(new Sprite(parseInt(Math.random() * 400), parseInt(Math.random() * 400)));
    }
    
    function Quadtree(){
        this.maxDepth = 2;
        this.currentDepth = 0;
        this.width = stage.width;
        this.height = stage.height;
        this.init();
    }
    
    Quadtree.prototype = {
        nodes: {}
        , init: function(){
            this.nodes[0] = {
                depth: 0
                , elements: []
                , bounds: {
                	width: stage.width / 2,
                	height: stage.height / 2,
                    offset: {
                        x: 0,
                        y: 0
                    }
                }
            };
            this.nodes[1] = {
                depth: 0
                , elements: []
                , bounds: {
                    width: stage.width / 2,
                    height: stage.height / 2,
                    offset: {
                        x: stage.width / 2,
                        y: 0
                    }
                }
            };
            this.nodes[2] = {
                depth: 0
                , elements: []
                , bounds: {
                    width: stage.width / 2,
                    height: stage.height / 2,
                    offset: {
                        x: 0,
                        y: stage.height / 2
                    }
                }
            };
            this.nodes[3] = {
                depth: 0
                , elements: []
                , bounds: {
                    width: stage.width / 2,
                    height: stage.height / 2,
                    offset: {
                        x: stage.width / 2,
                        y: stage.height / 2
                    }
                }
            };
        }
        , update: function(node){

            for(var i in sprites){

                if(Math.floor(sprites[i].x / (this.width / 2)) === 0 && Math.floor(sprites[i].y / (this.height / 2)) === 0){
                    node[0].elements.push(sprites[i]);
                    sprites[i].quadrant = 'a';

                }else if(Math.floor(sprites[i].x / (this.width / 2)) === 1 && Math.floor(sprites[i].y / (this.height / 2)) === 0){
                    node[1].elements.push(sprites[i]);
                    sprites[i].quadrant = 'b';

                }else if(Math.floor(sprites[i].x / (this.width / 2)) === 0 && Math.floor(sprites[i].y / (this.height / 2)) === 1){
                    node[2].elements.push(sprites[i]);
                    sprites[i].quadrant = 'c';

                }else{
                    node[3].elements.push(sprites[i]);
                    sprites[i].quadrant = 'd';

                }
            }

            for(var j in this.nodes){
                if(this.nodes[j].elements.length > 0){
                    this.subdivide(this.nodes[j]);
                }
            }
        }

        , subdivide: function(node){
            if(node.depth > this.maxDepth){
                return;
            }

            if(node.elements.length > 0){
                node.nodes = {}
                for(var i = 0; i < 4; i++){
                    node.nodes[i] = {
                        depth: node.depth + 1
                        , bounds: {
                            width: node.bounds.width / 2,
                            height: node.bounds.height / 2,
                            offset: {}
                        }
                        ,elements: []
                    };
                }

                node.nodes[0].bounds.offset = {
                    x: node.bounds.offset.x,
                    y: node.bounds.offset.y
                }

                node.nodes[1].bounds.offset = {
                    x: node.bounds.offset.x + node.bounds.width / 2,
                    y: node.bounds.offset.y
                }

                node.nodes[2].bounds.offset = {
                    x: node.bounds.offset.x,
                    y: node.bounds.offset.y + node.bounds.height / 2
                }

                node.nodes[3].bounds.offset = {
                    x: node.bounds.offset.x + node.bounds.width / 2,
                    y: node.bounds.offset.y + node.bounds.height / 2
                }

                for(var k = node.elements.length - 1; k >= 0; k--){
                    if(Math.floor((node.elements[k].x - node.bounds.offset.x) / (node.bounds.width / 2)) === 0 && Math.floor((node.elements[k].y - node.bounds.offset.y) / (node.bounds.height / 2)) === 0){
                        // console.log(node.elements[k], 'a', k)
                        node.nodes[0].elements.push(node.elements[k]);
                        console.log(k);
                        node.nodes[0].elements[node.nodes[0].elements.length - 1].quadrant += 'a';
                        node.elements.splice(k, 1);

                    }else if(Math.floor((node.elements[k].x - node.bounds.offset.x) / (node.bounds.width / 2)) === 1 && Math.floor((node.elements[k].y - node.bounds.offset.y) / (node.bounds.height / 2)) === 0){
                        // console.log(node.elements[k], 'b', k)
                        node.nodes[1].elements.push(node.elements[k]);
                        console.log(k);
                        node.nodes[1].elements[node.nodes[1].elements.length - 1].quadrant += 'b';
                        node.elements.splice(k, 1);

                    }else if(Math.floor((node.elements[k].x - node.bounds.offset.x) / (node.bounds.width / 2)) === 0 && Math.floor((node.elements[k].y - node.bounds.offset.y) / (node.bounds.height / 2)) === 1){
                        // console.log(node.elements[k], 'c', k)
                        node.nodes[2].elements.push(node.elements[k]);
                        console.log(k);
                        node.nodes[2].elements[node.nodes[2].elements.length - 1].quadrant += 'c';
                        node.elements.splice(k, 1);

                    }else if(Math.floor((node.elements[k].x - node.bounds.offset.x) / (node.bounds.width / 2)) === 1 && Math.floor((node.elements[k].y - node.bounds.offset.y) / (node.bounds.height / 2)) === 1){
                        // console.log(node.elements[k], 'd', k)
                        node.nodes[3].elements.push(node.elements[k]);
                        console.log(k);
                        node.nodes[3].elements[node.nodes[3].elements.length - 1].quadrant += 'd';
                        node.elements.splice(k, 1);

                    }
                }
            }

            if(node.hasOwnProperty('nodes')){
                for(var j in node.nodes){

                    context.globalCompositeOperation = 'source-over';
                    context.fillStyle = 'rgba(' + parseInt(Math.random() * 255) + ', ' + parseInt(Math.random() * 255) + ', ' + parseInt(Math.random() * 255) + ', 255)';
                    context.fillRect(node.nodes[j].bounds.offset.x, node.nodes[j].bounds.offset.y, node.nodes[j].bounds.width, node.nodes[j].bounds.height);
                }

                context.fillStyle = '#000000';
                drawSprites();
            }
        }
    };
    
    var quadtree = new Quadtree();

    function drawSprites(){
        for(var i in sprites){
            context.fillRect(sprites[i].x, sprites[i].y, 4, 4);
        }
    }

    drawSprites();

    for(var i in quadtree.nodes){

		context.globalCompositeOperation = 'destination-over';


    	context.fillStyle = 'rgba(' + parseInt(Math.random() * 255) + ', ' + parseInt(Math.random() * 255) + ', ' + parseInt(Math.random() * 255) + ', 255)';
    	context.fillRect(quadtree.nodes[i].bounds.offset.x, quadtree.nodes[i].bounds.offset.y, quadtree.nodes[i].bounds.width, quadtree.nodes[i].bounds.height);
    	// for(var j = 0; j < 4; j++){
    	// 	console.log(quadtree.nodes[i].bounds[j]);
    	// }
    }

// })();










