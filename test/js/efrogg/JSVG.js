var JSVG = function (svg) {
    var self = this;
    if (!svg) {
        this.$svg = new JNode("svg").$node;
        this.root = new Sprite(new JNode("g").attr("root",1));
        this.root.setStage(self);
        this.$svg.append(this.root.$node);
    } else {
        this.$svg = svg;
        //TODO : apprentissage
    }

    this.need_refresh=false;

    this.setFramerate();
    this.setTickrate(100);
};
JSVG.prototype.trigger = function (event,params) {
    this.root.$node.trigger(event,params);
};
JSVG.prototype.on = function (event_name,listener) {
    this.root.$node.on(event_name,listener);
};
JSVG.prototype.setTickrate = function (fps) {
    var self = this;
    clearInterval(self.tick_interval);
    var interval_ms=1000/fps;
    var lastTick= performance.now(),
        tick = function() {
            var tick=performance.now();
            params=[{
               time_ratio:(tick-lastTick)/interval_ms
            }];
            self.trigger("tick",params);
            lastTick=tick;
        };
    self.tick_interval = setInterval(tick,interval_ms);
    return this;
};
JSVG.prototype.setFramerate = function (fps) {
    var self = this;
    self.fps=fps||"max";

    var onEnterFrame = function() {
        //this.dispatchEvent(new Event("EnterFrame",this));
        if(self.need_refresh) {
            self.root.refresh();
            self.need_refresh=false;
        }
        if(self.fps == "max" && window.requestAnimationFrame) window.requestAnimationFrame(onEnterFrame);
    };

    clearInterval(self.fps_interval);
    if(self.fps == "max" && window.requestAnimationFrame) window.requestAnimationFrame(onEnterFrame);
    else {
        self.fps_interval=setInterval(onEnterFrame,1000/self.fps);
    }  // 50 fps
    return this;

};
JSVG.prototype.askRefresh = function () {
    this.need_refresh=true;
};
JSVG.prototype.getRoot = function () {
    return this.$svg;
};
JSVG.prototype.setViewBox = function (x, y, l, h) {
    this.$svg.attr("viewBox", x + " " + y + " " + l + " " + h);
    return this;
};
JSVG.prototype.addChild = function (child) {
    this.root.addChild(child);
    return this;
};

var JKeyboard = function() {
    this.left=37;
    this.right=39;
    this.up=38;
    this.down=40;
    this.esc=27;
    this.enter=13;
    this.space=32;
    var keys=[];
    $(document).on("keydown",function(e) {
        keys[e.which]=true;
        if(e.which!=116) {
            e.preventDefault();
            e.stopPropagation();
        }

    }).on("keyup",function(e) {
        keys[e.which]=false;
    });
    this.isDown = function(which) {
        return keys[which]?true:false;
    }

};

var JNode = function (node_name) {
    this.$node = $(document.createElementNS('http://www.w3.org/2000/svg', node_name));
    this.position = function (x, y) {
        this.$node
            .attr({
                x: x,
                y: y
            });
        return this;
    };
    this.attr = function (k, v) {
        this.$node.attr(k, v);
        return this;
    }
};

var JRect = function (x, y, w, h) {
    var rect = new JNode("rect");
    rect.position(x, y)
    .attr({
        width: w,
        height: h
    });
    return rect;
};