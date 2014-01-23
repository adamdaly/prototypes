var predetor = document.getElementById('predetor'),
    prey = document.getElementById('prey'),
    offset = 0,
    Kp = 4,
    proportion = 0,
    Ki = 10,
    totalOffsets = 0,
    integral = 0,
    t = 0;

setInterval(function(){
    prey.style.left = Math.random() * 400 + 'px';
    
}, 2000);


predetor.style.left = '0px';
prey.style.left = '0px';

var tick = function(){
    t++;
    offset = parseFloat(prey.style.left) - parseFloat(predetor.style.left);
    proportion = offset / Kp;
    totalOffsets += parseFloat(prey.style.left);
    integral = (totalOffsets / t) / Ki;
    predetor.style.left = parseFloat(predetor.style.left) + proportion + integral + 'px';

    window.requestAnimationFrame(tick);
}

tick();
