var stage = document.getElementById('stage'),
    context = stage.getContext('2d'),
    output = document.getElementById('output');

stage.width = 400;
stage.height = 400;

var celestialBodys = [];

function CelestialBody(name, mass, radius, x, y, color){
    this.name = name;
    this.mass = mass;
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.color = color;
    
    celestialBodys.push(this);
    this.init();
}

CelestialBody.prototype = {
    init: function(){
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
    }
    , draw: function(){
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();        
    }
}

var sun = new CelestialBody('sun', 100000, 50, 200, 200, '#FFFF00');

var earth = new CelestialBody('earth', 0.1, 5, 200, 10, '#0000FF');
earth.velocity = { x: 8, y: 0 };

var G = 0.001; //Math.pow(6.67384, -11);
var r = Math.sqrt(Math.pow(sun.x - earth.x, 2) + Math.pow(sun.y - earth.y, 2)),
  offset = {
    x: sun.x - earth.x,
    y: sun.y - earth.y
  }

var f = (G * (sun.mass - earth.mass)) / Math.pow(r, 2);

function radian2degree(radian){
  return radian * (180 / Math.PI);
}

function returnComponent(magnitude, offset){
  var angle = Math.acos(offset / magnitude);
  var projection = magnitude * Math.cos(angle);
    
  return projection;
}

function returnRadius(a, b){
  return  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function returnGravity(a, b){
  return (G * (a.mass - b.mass)) / Math.pow(returnRadius(a, b), 2);
}

function tick(){
  // r = returnRadius(sun, earth);//Math.sqrt(Math.pow(sun.x - earth.x, 2) + Math.pow(sun.y - earth.y, 2));
  f = returnGravity(sun, earth);//(G * (sun.mass - earth.mass)) / Math.pow(r, 2);
  offset = {
    x: sun.x - earth.x,
    y: sun.y - earth.y
  }
  
  //console.log(returnComponent(r, offset.x), returnComponent(r, offset.y));

  earth.velocity.x += f * returnComponent(r, offset.x);
  earth.velocity.y += f * returnComponent(r, offset.y);

  earth.x += earth.velocity.x;
  earth.y += earth.velocity.y;

  context.clearRect(0, 0, 400, 400);

  earth.draw();
  sun.draw();

  webkitRequestAnimationFrame(tick);
  // setTimeout(tick, 500);
}

tick();