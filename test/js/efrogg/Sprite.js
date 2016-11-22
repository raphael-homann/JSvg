/**
 * Created by raph on 17/11/16.
 */

Sprite=function($node_origin) {
    if($node_origin instanceof JNode) $node_origin=$node_origin.$node;
    // wrap le noeud
    var self = this;

    $node_origin.wrap(document.createElementNS('http://www.w3.org/2000/svg', 'g'));

    this.root = null;
    this.$node = $node_origin.parent();
    this.$node_origin = $node_origin;

    this.children = [];
    this._position = {x:0,y:0,z:0};
    this._rotation = {x:0,y:0,z:0};
    this._pivotMove = {x:0,y:0,z:0};
    this._scale = {x:1,y:1,z:1};

    this.shortRotation = true;
    this.rotationForceDirection = 0;
    this._tween_rotation = false;

    this.needRefresh = false;

    this.addChild = function(child){
        self.children.push(child);
        child.setStage(this.root);
        this.addGraphic(child);
        return this;
    };
    this.addGraphic = function(graphic) {
        this.$node.append(graphic.$node)
    }

};

Sprite.prototype.clone = function() {
    var sprite = new Sprite(this.$node_origin.clone());
};
/*
gestion de l'affichage
 */
Sprite.prototype.askRefresh = function() {
    this.needRefresh = true;
    if(this.root) {
        this.root.askRefresh();
    } else {
        this.applyTransform();
    }
};

Sprite.prototype.refresh = function() {
    //console.log("refresh",this.children.length);
    this.applyTransform();
    this.children.every(function(child) {
        child.refresh();
    });
};


Sprite.prototype.applyTransform = function() {
    if(this.needRefresh) {
        this.needRefresh = false;
        var scale_transform = "scale(" + this._scale.x + ")";

        var rotate_transform = "rotate(" + this._rotation.z + " " + this._pivotMove.x + "," + this._pivotMove.y + ")";
        //this.$node.attr("transform", rotate_transform);


        var translate_transform = "translate(" + (this._position.x - (this._pivotMove.x * this._scale.x)) + " " + (this._position.y - (this._pivotMove.y * this._scale.y)) + ")";
        this.$node.attr("transform", translate_transform + " " + scale_transform+" "+rotate_transform);
    }
};



/*
 * getters / setters properties
 */
Object.defineProperty(Sprite.prototype, "x",{
    get: function() {
        return this._position.x;
    },
    set: function(x) {
        this._position.x = x;
        this.askRefresh();
    }
});
Object.defineProperty(Sprite.prototype, "y",{
    get: function() {
        return this._position.y;
    },
    set: function(y) {
        this._position.y = y;
        this.askRefresh();
    }
});
Object.defineProperty(Sprite.prototype, "rotation",{
    get: function() {
        return this._rotation.z;
    },
    set: function(angle) {
        this._rotation.z = angle;
        this.askRefresh();
    }
});

Object.defineProperty(Sprite.prototype, "scaleX",{
    get: function() {
        return this._scale.x;
    },
    set: function(scale) {
        this._scale.x = scale;
        this.askRefresh();
    }
});
Object.defineProperty(Sprite.prototype, "scaleY",{
    get: function() {
        return this._scale.y;
    },
    set: function(scale) {
        this._scale.y = scale;
        this.askRefresh();
    }
});

/*
public methods pour manipulation
 */
Sprite.prototype.moveOf = function(x,y,directional,vitesse) {
    var dx= x,dy=y;
    if(directional) {
        var arad = this.rotation*Math.PI/180;
        dx=Math.cos(arad)*y+Math.cos(arad+Math.PI/2)*x;
        dy=Math.sin(arad)*y+Math.sin(arad+Math.PI/2)*x;
    }
    this.moveTo(this.x+dx,this.y+dy);
};
Sprite.prototype.moveTo = function(x,y,relative,vitesse) {
    relative = relative || false;
    vitesse = vitesse || 0;

    if(relative) {
        this.x += x;
        this.y += y;
    } else {
        this.x = x;
        this.y = y;
    }
    return this;
};
Sprite.prototype.scaleTo = function(ratio) {
    this._scale.x = ratio;
    this._scale.y = ratio;
    this._scale.z = ratio;
    return this;
};
Sprite.prototype.rotateOf = function(angle,vitesse,ease) {
  return this.rotateTo(angle+this.rotation,vitesse,ease)
};
Sprite.prototype.rotateTo = function(angle,vitesse,ease) {
    vitesse = vitesse || 0;
    ease = ease || Quad.easeOut;

    var next_rotation = angle;

    next_rotation %= 360;

    // shortRotation : évite de tourner à l'envers au tour complet ;)
    var distance;
    if(this.rotationForceDirection > 0) {
        distance = next_rotation-(this.rotation%360);
        // ex : 80 -> 70 => diff = -10 => -280 -> 70
        this.rotation%=360;
        if(distance<0) {
            next_rotation += 360;
        }
    } else if(this.rotationForceDirection < 0) {
        distance = next_rotation-(this.rotation%360);
        // ex : 80 -> 70 => diff = -10 => -280 -> 70
        this.rotation%=360;
        if(distance>0) {
            next_rotation -= 360;
        }
    } else if(this.shortRotation) {
        distance = next_rotation-this.rotation;
        if(distance<-180) {
            // (on revient en arrière)
            this.rotation = this.rotation%360-360;
        } else  if(distance>180) {
            // ex : 0 -> 270 => diff = 270 => 360 -> 270
            this.rotation=this.rotation%360+360;
            // (on retourne)
        }
    }
    if(this._tween_rotation) this._tween_rotation.pause();
    this._tween_rotation = TweenLite.to(this, vitesse, {rotation:next_rotation,ease:ease});
    return this;
//
};

Sprite.prototype.setStage = function(stage) {
    this.root=stage;
    this.children.every(function(child) {
        child.setStage(stage);
    })
};
Sprite.prototype.setPivot = function(x,y,z,compensation) {
    compensation = (typeof compensation === "undefined"?true:compensation);
    x = x || 0;
    y = y || 0;
    z = z || 0;

    if(compensation){
        var dx = x-this._pivotMove.x,
         dy = y-this._pivotMove.y,
         dz = z-this._pivotMove.z;
        this.moveTo(dx,dy,true);
    }

    this._pivotMove={x:x,y:y,z:z};

    this.askRefresh();                                          // refresh du pivot
    return this;
};
