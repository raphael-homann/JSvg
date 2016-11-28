class JSprite {
    constructor($node_origin, nowrap) {
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
        this._position = {x: 0, y: 0, z: 0};
        this._rotation = {x: 0, y: 0, z: 0};
        this._pivotMove = {x: 0, y: 0, z: 0};
        this._scale = {x: 1, y: 1, z: 1};

        this.shortRotation = true;
        this.rotationForceDirection = 0;
        this._tween_rotation = false;

        this.needRefresh = false;
    }

    clone() {
        return new JSprite(this.$node.clone(), true);
    };


    addChild(child) {
        this.children.push(child);
        child.setStage(this.root);
        this.addGraphic(child);
        return this;
    }

    addGraphic(graphic) {
        this.$node.append(graphic.$node)
    }

    /*
     gestion de l'affichage
     */
    askRefresh() {
        this.needRefresh = true;
        if (this.root) {
            this.root.askRefresh();
        } else {
            this.applyTransform();
        }
    };

    refresh() {
        //console.log("refresh",this.children.length);
        this.applyTransform();
        this.children.every(function (child) {
            child.refresh();
        });
    };


    applyTransform() {
        if (this.needRefresh) {
            var round2 = function (num) {
                return Math.round(num * 100) / 100;
            };
            this.needRefresh = false;
            var scale_transform = "scale(" + round2(this._scale.x) + ")";

            var rotate_transform = "rotate(" + round2(this._rotation.z) + " " + round2(this._pivotMove.x) + "," + round2(this._pivotMove.y) + ")";
            //this.$node.attr("transform", rotate_transform);


            var translate_transform = "translate(" + round2(this._position.x - (this._pivotMove.x * this._scale.x))
                + " " + round2(this._position.y - (this._pivotMove.y * this._scale.y)) + ")";
            this.$node.attr("transform", translate_transform + " " + scale_transform + " " + rotate_transform);
        }
    };

    get x() {
        return this._position.x;
    }

    set x(x) {
        this._position.x = x;
        this.askRefresh();
    }


    get y() {
        return this._position.y;
    }

    set y(y) {
        this._position.y = y;
        this.askRefresh();
    }

    get rotation() {
        return this._rotation.z;
    }

    set rotation(angle) {
        this._rotation.z = angle;
        this.askRefresh();
    }

    get scaleX() {
        return this._scale.x;
    }

    set scaleX(scale) {
        this._scale.x = scale;
        this.askRefresh();
    }

    get scaleY() {
        return this._scale.y;
    }

    set scaleY(scale) {
        this._scale.y = scale;
        this.askRefresh();
    }

    /*
     public methods pour manipulation
     */
    moveOf(x, y, directional, vitesse) {
        var dx = x, dy = y;
        if (directional) {
            var arad = this.rotation * Math.PI / 180;
            dx = Math.cos(arad) * y + Math.cos(arad + Math.PI / 2) * x;
            dy = Math.sin(arad) * y + Math.sin(arad + Math.PI / 2) * x;
            //console.log("x,y",dx,dy);
        }
        this.moveTo(this.x + dx, this.y + dy,false,vitesse);
    };

    moveTo(x, y, relative=false, vitesse=0) {

        if (relative) {
            this.x += x;
            this.y += y;
        } else {
            this.x = x;
            this.y = y;
        }
        return this;
    };

    scaleTo(ratio) {
        this._scale.x = ratio;
        this._scale.y = ratio;
        this._scale.z = ratio;
        return this;
    };

    rotateOf(angle, vitesse, ease) {
        return this.rotateTo(angle + this.rotation, vitesse, ease)
    };

    rotateTo(angle, vitesse, ease) {
        vitesse = vitesse || 0;
        ease = ease || Quad.easeOut;

        var next_rotation = angle;

        next_rotation %= 360;

        // shortRotation : évite de tourner à l'envers au tour complet ;)
        var distance;
        if (this.rotationForceDirection > 0) {
            distance = next_rotation - (this.rotation % 360);
            // ex : 80 -> 70 => diff = -10 => -280 -> 70
            this.rotation %= 360;
            if (distance < 0) {
                next_rotation += 360;
            }
        } else if (this.rotationForceDirection < 0) {
            distance = next_rotation - (this.rotation % 360);
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
        this._tween_rotation = TweenLite.to(this, vitesse, {rotation: next_rotation, ease: ease});
        return this;
//
    };

    setStage(stage) {
        this.root = stage;
        this.children.every(function (child) {
            child.setStage(stage);
        })
    };

    setPivot(x, y, z, compensation) {
        compensation = (typeof compensation === "undefined" ? true : compensation);
        x = x || 0;
        y = y || 0;
        z = z || 0;

        if (compensation) {
            var dx = x - this._pivotMove.x,
                dy = y - this._pivotMove.y,
                dz = z - this._pivotMove.z;
            this.moveTo(dx, dy, true);
        }

        this._pivotMove = {x: x, y: y, z: z};

        this.askRefresh();                                          // refresh du pivot
        return this;
    };
}
