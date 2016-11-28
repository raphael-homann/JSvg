class JSVG {
    constructor(svg) {
        if (!svg) {
            this.$svg = new JNode("svg").$node;
            this.root = new Sprite(new JNode("g").attr("root",1));
            this.root.setStage(self);
            this.$svg.append(this.root.$node);
        } else {
            this.$svg = svg;
            //TODO : apprentissage /  découverte
        }
    }
}

