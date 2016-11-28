class JNode {
    constructor(nodeName) {
        this.$node = $(document.createElementNS('http://www.w3.org/2000/svg', nodeName));
        this.position = function (x, y) {
            this.$node
                .attr({
                    x: x,
                    y: y
                });
            return this;
        };
    }
    attr(k, v) {
        this.$node.attr(k, v);
        return this;
    }
}
