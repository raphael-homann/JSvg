"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JNode = function JNode(nodeName) {
    _classCallCheck(this, JNode);
};
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JSVG = function JSVG(svg) {
    _classCallCheck(this, JSVG);

    if (!svg) {
        this.$svg = new JNode("svg").$node;
        this.root = new Sprite(new JNode("g").attr("root", 1));
        this.root.setStage(self);
        this.$svg.append(this.root.$node);
    } else {
        this.$svg = svg;
        //TODO : apprentissage /  découverte
    }
};
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JSprite = function JSprite(node) {
    _classCallCheck(this, JSprite);
};
//# sourceMappingURL=all.js.map
