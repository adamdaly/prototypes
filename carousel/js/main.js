
var carousel = document.getElementById('carousel');

[].forEach.call(carousel.children, function(element, index){
    element.addEventListener('click', function(e){
        console.log(e.srcElement);
    });
})

function Carousel(carousel, object){
    this.carousel = carousel;
    this.items = carousel.children;
    this.length = this.items.length;
    this.defaults = {
        visible: 2,
        auto: false,
        delay: 0,
        duration: 1000,
        interval: 1500,
        preloadTime: 400,
        index: 0,
        onLoad: function(){},
        onUpdate: function(){},
        onReset: function(){},
        onPagination: function(){}
    };

    this.init();
}

Carousel.prototype = {
    init: function() {
        console.log('init');

        this.defaults.onLoad.call();

        this.setupClasses();

    }

    , setupClasses: function(){

        var that = this;

        for(var i = that.defaults.index; i < that.defaults.index + that.defaults.visible; i++){
            that.items[i].classList.add('active');
        }
    }

    , update: function() {
        // var $element = $(element),
        //     $parent = $element.find('.items'),
        //     $items = $element.find('.item'),
        //     that = this;

        var that = this,
            items = that.carousel.children,
            firstNode = items[0],
            lastNode = items[items.length - 1];

        that.defaults.index++;

        that.carousel.classList.add('updating');
        
        [].forEach.call(items, function(element, index){
            element.classList.add('updating');// Triggers CSS Animations
        });

        // Decending

        var duplicateNode = lastNode.cloneNode(true);
        that.carousel.insertBefore(duplicateNode, firstNode);

        setTimeout(function(){
            that.carousel.removeChild(duplicateNode);
            that.carousel.insertBefore(lastNode, firstNode);

            [].forEach.call(items, function(element, index){
                element.classList.remove('updating');
                element.classList.remove('active');

                if(index < that.defaults.visible){
                    element.classList.remove('decendant');
                    element.classList.add('active');
                }
            });

        }, 2000);


        // Ascending

        // var duplicateNode = firstNode.cloneNode(true);
        // that.carousel.insertBefore(duplicateNode, firstNode);
        // that.carousel.appendChild(firstNode, lastNode);

        // setTimeout(function(){
        //     that.carousel.removeChild(duplicateNode);

        //     [].forEach.call(items, function(element, index){
        //         element.classList.remove('updating');
        //         element.classList.remove('active');

        //         if(index < that.defaults.visible){
        //             element.classList.remove('decendant');
        //             element.classList.add('active');
        //         }
        //     });

        // }, 2000);

        // that.options.onUpdate.call(this);
    }
};

var carousel1 = new Carousel(carousel);