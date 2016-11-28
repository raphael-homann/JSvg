'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JNode = function () {
    function JNode(nodeName) {
        _classCallCheck(this, JNode);

        this.$node = $(document.createElementNS('http://www.w3.org/2000/svg', nodeName));
        this.position = function (x, y) {
            this.$node.attr({
                x: x,
                y: y
            });
            return this;
        };
    }

    _createClass(JNode, [{
        key: 'attr',
        value: function attr(k, v) {
            this.$node.attr(k, v);
            return this;
        }
    }]);

    return JNode;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JSVG = function () {
    function JSVG(svg) {
        _classCallCheck(this, JSVG);

        if (!svg) {
            this.$svg = new JNode("svg").$node;
            this.root = new JSprite(new JNode("g").attr("root", 1));
            this.root.setStage(this);
            this.$svg.append(this.root.$node);
        } else {
            this.$svg = svg;
            //TODO : apprentissage /  découverte
        }

        this.need_refresh = false;

        this.setFramerate();
        this.setTickrate(100);
    }

    _createClass(JSVG, [{
        key: "trigger",
        value: function trigger(event, params) {
            this.root.$node.trigger(event, params);
        }
    }, {
        key: "on",
        value: function on(event_name, listener) {
            this.root.$node.on(event_name, listener);
        }
    }, {
        key: "setTickrate",
        value: function setTickrate(fps) {
            var self = this;
            clearInterval(this.tick_interval);
            var interval_ms = 1000 / fps;
            var lastTick = performance.now(),
                tick = function tick() {
                var tick = performance.now();
                var params = [{
                    time_ratio: (tick - lastTick) / interval_ms
                }];
                self.trigger("tick", params);
                lastTick = tick;
            };
            this.tick_interval = setInterval(tick, interval_ms);
            return this;
        }
    }, {
        key: "setFramerate",
        value: function setFramerate(fps) {
            this.fps = fps || "max";
            var self = this;
            var onEnterFrame = function onEnterFrame() {
                //this.dispatchEvent(new Event("EnterFrame",this));
                if (self.need_refresh) {
                    self.root.refresh();
                    self.need_refresh = false;
                }
                if (self.fps == "max" && window.requestAnimationFrame) window.requestAnimationFrame(onEnterFrame);
            };

            clearInterval(this.fps_interval);
            if (this.fps == "max" && window.requestAnimationFrame) window.requestAnimationFrame(onEnterFrame);else {
                this.fps_interval = setInterval(onEnterFrame, 1000 / this.fps);
            } // 50 fps
            return this;
        }
    }, {
        key: "askRefresh",
        value: function askRefresh() {
            this.need_refresh = true;
        }
    }, {
        key: "getRoot",
        value: function getRoot() {
            return this.$svg;
        }
    }, {
        key: "setViewBox",
        value: function setViewBox(x, y, l, h) {
            this.$svg.attr("viewBox", x + " " + y + " " + l + " " + h);
            return this;
        }
    }, {
        key: "addChild",
        value: function addChild(child) {
            this.root.addChild(child);
            return this;
        }
    }]);

    return JSVG;
}();

var JKeyboard = function () {
    function JKeyboard() {
        _classCallCheck(this, JKeyboard);

        this.left = 37;
        this.right = 39;
        this.up = 38;
        this.down = 40;
        this.esc = 27;
        this.enter = 13;
        this.space = 32;
        this.keys = [];

        var self = this;
        $(document).on("keydown", function (e) {
            self.keys[e.which] = true;
            if (e.which != 116) {
                e.preventDefault();
                e.stopPropagation();
            }
        }).on("keyup", function (e) {
            self.keys[e.which] = false;
        });
    }

    _createClass(JKeyboard, [{
        key: "isDown",
        value: function isDown(which) {
            return this.keys[which] ? true : false;
        }
    }]);

    return JKeyboard;
}();

var JRect = function (_JNode) {
    _inherits(JRect, _JNode);

    function JRect(x, y, w, h) {
        _classCallCheck(this, JRect);

        var _this = _possibleConstructorReturn(this, (JRect.__proto__ || Object.getPrototypeOf(JRect)).call(this, "rect"));

        _this.position(x, y).attr({
            width: w,
            height: h
        });
        return _this;
    }

    return JRect;
}(JNode);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JSprite = function () {
    function JSprite($node_origin, nowrap) {
        _classCallCheck(this, JSprite);

        if ($node_origin instanceof JNode) $node_origin = $node_origin.$node;
        // wrap le noeud

        if (!nowrap) {
            $node_origin.wrap(document.createElementNS('http://www.w3.org/2000/svg', 'g'));
            this.$node = $node_origin.parent();
            this.$node_origin = $node_origin;
            this.$node_origin.addClass("child-node");
        } else {
            this.$node = $node_origin;
            this.$node_origin = $node_origin.find(">.child-node");
        }

        this.root = null;

        this.children = [];
        this._position = { x: 0, y: 0, z: 0 };
        this._rotation = { x: 0, y: 0, z: 0 };
        this._pivotMove = { x: 0, y: 0, z: 0 };
        this._scale = { x: 1, y: 1, z: 1 };

        this.shortRotation = true;
        this.rotationForceDirection = 0;
        this._tween_rotation = false;

        this.needRefresh = false;
    }

    _createClass(JSprite, [{
        key: 'clone',
        value: function clone() {
            return new JSprite(this.$node.clone(), true);
        }
    }, {
        key: 'addChild',
        value: function addChild(child) {
            this.children.push(child);
            child.setStage(this.root);
            this.addGraphic(child);
            return this;
        }
    }, {
        key: 'addGraphic',
        value: function addGraphic(graphic) {
            this.$node.append(graphic.$node);
        }

        /*
         gestion de l'affichage
         */

    }, {
        key: 'askRefresh',
        value: function askRefresh() {
            this.needRefresh = true;
            if (this.root) {
                this.root.askRefresh();
            } else {
                this.applyTransform();
            }
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            //console.log("refresh",this.children.length);
            this.applyTransform();
            this.children.every(function (child) {
                child.refresh();
            });
        }
    }, {
        key: 'applyTransform',
        value: function applyTransform() {
            if (this.needRefresh) {
                var round2 = function round2(num) {
                    return Math.round(num * 100) / 100;
                };
                this.needRefresh = false;
                var scale_transform = "scale(" + round2(this._scale.x) + ")";

                var rotate_transform = "rotate(" + round2(this._rotation.z) + " " + round2(this._pivotMove.x) + "," + round2(this._pivotMove.y) + ")";
                //this.$node.attr("transform", rotate_transform);


                var x = round2(this._position.x - this._pivotMove.x * this._scale.x),
                    y = round2(this._position.y - this._pivotMove.y * this._scale.y),
                    translate_transform = "translate(" + x + " " + y + ")";
                //console.log(this.$node,translate_transform + " " + scale_transform + " " + rotate_transform);
                this.$node.attr({
                    "transform": translate_transform + " " + scale_transform + " " + rotate_transform
                    //"x":x,
                    //"y":y
                });
            }
        }
    }, {
        key: 'moveOf',


        /*
         public methods pour manipulation
         */
        value: function moveOf(x, y, directional, vitesse) {
            var dx = x,
                dy = y;
            if (directional) {
                var arad = this.rotation * Math.PI / 180;
                dx = Math.cos(arad) * y + Math.cos(arad + Math.PI / 2) * x;
                dy = Math.sin(arad) * y + Math.sin(arad + Math.PI / 2) * x;
                //console.log("x,y",dx,dy);
            }
            this.moveTo(this.x + dx, this.y + dy, false, vitesse);
        }
    }, {
        key: 'moveTo',
        value: function moveTo(x, y) {
            var relative = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var vitesse = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;


            if (relative) {
                this.x += x;
                this.y += y;
            } else {
                this.x = x;
                this.y = y;
            }
            return this;
        }
    }, {
        key: 'scaleTo',
        value: function scaleTo(ratio) {
            this._scale.x = ratio;
            this._scale.y = ratio;
            this._scale.z = ratio;
            return this;
        }
    }, {
        key: 'rotateOf',
        value: function rotateOf(angle, vitesse, ease) {
            return this.rotateTo(angle + this.rotation, vitesse, ease);
        }
    }, {
        key: 'rotateTo',
        value: function rotateTo(angle, vitesse, ease) {
            vitesse = vitesse || 0;
            ease = ease || Quad.easeOut;

            var next_rotation = angle;

            next_rotation %= 360;

            // shortRotation : évite de tourner à l'envers au tour complet ;)
            var distance;
            if (this.rotationForceDirection > 0) {
                distance = next_rotation - this.rotation % 360;
                // ex : 80 -> 70 => diff = -10 => -280 -> 70
                this.rotation %= 360;
                if (distance < 0) {
                    next_rotation += 360;
                }
            } else if (this.rotationForceDirection < 0) {
                distance = next_rotation - this.rotation % 360;
                // ex : 80 -> 70 => diff = -10 => -280 -> 70
                this.rotation %= 360;
                if (distance > 0) {
                    next_rotation -= 360;
                }
            } else if (this.shortRotation) {
                distance = next_rotation - this.rotation;
                if (distance < -180) {
                    // (on revient en arrière)
                    this.rotation = this.rotation % 360 - 360;
                } else if (distance > 180) {
                    // ex : 0 -> 270 => diff = 270 => 360 -> 270
                    this.rotation = this.rotation % 360 + 360;
                    // (on retourne)
                }
            }
            if (this._tween_rotation) this._tween_rotation.pause();
            this._tween_rotation = TweenLite.to(this, vitesse, { rotation: next_rotation, ease: ease });
            return this;
            //
        }
    }, {
        key: 'setStage',
        value: function setStage(stage) {
            this.root = stage;
            this.children.every(function (child) {
                child.setStage(stage);
            });
        }
    }, {
        key: 'setPivot',
        value: function setPivot(x, y, z, compensation) {
            compensation = typeof compensation === "undefined" ? true : compensation;
            x = x || 0;
            y = y || 0;
            z = z || 0;

            if (compensation) {
                var dx = x - this._pivotMove.x,
                    dy = y - this._pivotMove.y,
                    dz = z - this._pivotMove.z;
                this.moveTo(dx, dy, true);
            }

            this._pivotMove = { x: x, y: y, z: z };

            this.askRefresh(); // refresh du pivot
            return this;
        }
    }, {
        key: 'x',
        get: function get() {
            return this._position.x;
        },
        set: function set(x) {
            this._position.x = x;
            this.askRefresh();
        }
    }, {
        key: 'y',
        get: function get() {
            return this._position.y;
        },
        set: function set(y) {
            this._position.y = y;
            this.askRefresh();
        }
    }, {
        key: 'rotation',
        get: function get() {
            return this._rotation.z;
        },
        set: function set(angle) {
            this._rotation.z = angle;
            this.askRefresh();
        }
    }, {
        key: 'scaleX',
        get: function get() {
            return this._scale.x;
        },
        set: function set(scale) {
            this._scale.x = scale;
            this.askRefresh();
        }
    }, {
        key: 'scaleY',
        get: function get() {
            return this._scale.y;
        },
        set: function set(scale) {
            this._scale.y = scale;
            this.askRefresh();
        }
    }]);

    return JSprite;
}();
//# sourceMappingURL=all.js.map
