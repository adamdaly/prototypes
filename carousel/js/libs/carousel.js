
;(function ( $, window, document, undefined ) {
    'use strict';
    var Plugin = function(element, options) {

        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    };
    var pluginName = 'carousel',
        defaults = {
            visible: 1,
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

    Plugin.prototype = {
        globalDelayTimer: null,
        globalDelayInterval: null,
        classResetTimer: null,
        init: function() {
            this.options.onLoad.call();
            var $carousel = $(this.element),
                $items = $carousel.find('.items'),
                $item = $carousel.find('.item'),
                $pagination = $carousel.find('.pagination'),
                that = this;

            that.setupClasses();

            $item.each(function(index, element){
                if(index === 0){
                    $pagination.append('<li class="selected"></li>');
                }else{
                    $pagination.append('<li></li>');
                }
                
            });

            var $pages = $pagination.children();
            $pages.on('click', function(){
                var $this = $(this),
                    index = $this.index(),
                    $active = $carousel.find('.active');

                if($this.hasClass('selected') || $carousel.hasClass('updating')){
                    return;
                }

                that.options.index = index;

                $pages.removeClass('selected');
                $this.addClass('selected');

                that.pause();// Pause the carousel

                $carousel.addClass('updating');

                var $updating = $items.children().filter(function(){ return $(this).data('index') === index; }).last();

                that.active = $active;
                that.updating = $updating;

                $updating.addClass('updating');
                $active.addClass('ascend');

                that.options.onPagination.call(that);
                that.options.onUpdate.call(that);

                setTimeout(function(){
                    $updating.removeClass('updating').removeClass('decendant').addClass('active');
                    $active.removeClass('active').removeClass('ascend').addClass('decendant');

                    $active = $item.filter(function(){ return $(this).data('index') === index; });

                    var activeIndex = $active.data('index'),
                        beforeIndex = activeIndex - 1,
                        afterIndex = activeIndex + 1,
                        $activeElement;

                    if(beforeIndex < 0){
                        beforeIndex = $item.length - 1;
                    }

                    if(afterIndex > $item.length - 1){
                        afterIndex = 0;
                    }

                    $items.children().each(function(index, element){
                        if(!$(element).hasClass('active')){
                            $(element).remove();
                        }
                    });

                    $item.each(function(index, element){
                        var offsetIndex = ((activeIndex + index - 1) + $item.length) % $item.length;
                        if(offsetIndex === activeIndex){
                            return;
                        }
                        if(index === 0){
                            $item.filter(function(){ return $(this).data('index') === offsetIndex; })
                                .addClass('ancestor')
                                .removeClass('decendant')
                                .prependTo($items);
                        }else{
                            $item.filter(function(){ return $(this).data('index') === offsetIndex; })
                                .addClass('decendant')
                                .removeClass('ancestor')
                                .appendTo($items);
                        }
                    });
                    
                    $items.children().eq(0).clone(true).removeClass('ancestor').addClass('decendant').appendTo($items);

                    $carousel.removeClass('updating');

                    that.auto();

                }, 2000);

            });

            $carousel.find('button').on('click', function(t) {
                if ($(that.element).hasClass('updating'))
                    return;
                if ($(this).hasClass('ancestor')) {
                    that.update(that.element, that.options, 'ancestor');
                } else {
                    that.update(that.element, that.options, 'decendant');
                }
            });

            $carousel.on('mouseenter', function(t) {
                // if (that.options.auto === true) {
                //     clearInterval(that.timer);
                //     clearInterval(globalDelayInterval);
                //     clearTimeout(globalDelayTimer);
                //     $(that.element).on('mouseleave', function() {
                //         that.auto(0);
                //         $(this).off('mouseleave');
                //     });
                // }
            });
        },
        setupClasses: function(){

            var that = this,
                $this = $(that.element),
                $parent = $this.find('.items'),
                $items = $this.find('.item'),
                $ancestor = $this.find('.ancestor');

                that.options.index = 0;
            
            if ($items.length <= that.options.visible) {
                $items.addClass('active');
                return;
            } else if ($items.length > that.options.visible) {
                $items.eq($items.length - 1).clone(true).removeClass('decendant').addClass('ancestor').prependTo($parent);
            }
            for (var i = 0; i < that.options.visible; i++) {
                $items.eq(i).addClass('active');
            }
            for (var j = that.options.visible; j < $items.length; j++) {
                $items.eq(j).addClass('decendant');
            }
            if (that.options.auto === true) {
                that.auto();
            }

            setTimeout(function(){
                $this.removeClass('preloading');
            }, that.options.preloadTime);

            that.cachedItems = [];
            $items.each(function(index, element){
                that.cachedItems.push($(element).clone(true));
            });
            
        },
        update: function(element, options, direction) {
            var $element = $(element),
                $parent = $element.find('.items'),
                $items = $element.find('.item'),
                that = this;

            that.options.index++;


            $element.addClass('updating');
            
            var firstActiveIndex = $parent.children('.active').eq(0).index();


            that.active = $parent.children('.active').eq(0);
            that.updating = $parent.children('.decendant').eq(0);

            that.options.onUpdate.call(this);
            

            if (direction === 'decendant') {
                
                $parent.children('.active').addClass('ascend');
                $parent.children('.decendant').eq(0).addClass('updating');
                that.updatePagination();
                that.classResetTimer = setTimeout(function() {
                    $parent.children('.item').removeClass('updating').removeClass('ascend');
                    $parent.children().eq(0).remove();
                    $parent.children().eq(0).removeClass('active').addClass('ancestor').clone(true).removeClass('ancestor').addClass('decendant').appendTo($parent);
                    $parent.children('.item').eq(firstActiveIndex - 1 + options.visible).removeClass('decendant').addClass('active');
                    $parent.removeClass('updating');
                    $element.removeClass('updating');
                },options.interval);
                
            } else {

                $parent.children('.active').addClass('descend');
                $parent.children('.ancestor').addClass('updating');
                that.updatePagination();
                that.classResetTimer = setTimeout(function() {
                    $parent.children('.ancestor').removeClass('updating').removeClass('ancestor').addClass('active');
                    $parent.children('.active').removeClass('descend');
                    $parent.children('.active').eq($element.children('.active').length - 1).removeClass('active').addClass('decendant');
                    $parent.children('.item').eq($element.children('.item').length - 1).remove();
                    $parent.children('.item').eq($element.children('.item').length - 1).clone(true).removeClass('decendant').addClass('ancestor').prependTo($parent);
                    $parent.removeClass('updating');
                    $element.removeClass('updating');
                },options.interval);
                
            }
        },

        updatePagination: function(){
            var that = this,
                $element = $(this.element),
                $pagination = $element.find('.pagination'),
                $pages = $pagination.children(),
                pagesLength = $pagination.children().length;

            $pages.removeClass('selected');

            if(that.options.index === pagesLength){
                that.options.index = 0;
            }

            $pagination.children().eq(that.options.index).addClass('selected');
        },

        auto: function() {
            var that = this;
            if (that.options.delay > 0) {
                // globalDelayTimer = setTimeout(function() {
                //     console.log(that.options.index);
                //     globalDelayInterval = setInterval(function() {
                //         that.update(that.element, that.options, 'decendant');
                //     }, that.options.duration + that.options.interval);
                // }, this.options.delay);
            } else {

                var timeOut;

                if(typeof that.options.duration === 'number'){
                    timeOut = that.options.duration + that.options.interval;
                }else{
                    timeOut = that.options.duration[0] + that.options.interval;
                }

                var timer = function(){
                    that.timer = setTimeout(function(){
                        that.update(that.element, that.options, 'decendant');

                        if(typeof that.options.duration === 'number'){
                            timeOut = that.options.duration + that.options.interval;
                        }else{
                            timeOut = that.options.duration[that.options.index] + that.options.interval;
                        }
                        timer(timeOut);
                    }, timeOut);
                };

                timer(timeOut);

            }
        },

        reset: function(){

            var that = this,
                $parent = $(that.element),
                $items = $parent.children('.items'),
                $pagination = $parent.children('.pagination'),
                $pages = $pagination.children();

            that.options.index = 0;

            clearTimeout(that.timer);
            clearTimeout(that.classResetTimer);            

            $items.empty();

            for(var i in that.cachedItems){
                $items.append(that.cachedItems[i]);
            }
            $parent.removeClass('updating');
            $pages.removeClass('selected');
            $pages.eq(0).addClass('selected');
            
            this.options.onReset.call();
        },

        pause: function(){
            var that = this;
            clearTimeout(that.timer);
        }
    };
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if(typeof options === 'object' || typeof options === 'undefined'){
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            }else{
                var plugin = $.data(this, 'plugin_' + pluginName);
                plugin[options].call(plugin);
            }
        });
    };
})($, window, document);