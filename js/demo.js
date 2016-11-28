/**
 * Created by raph on 22/11/16.
 */
$(function () {

    demo = new JSVG($("#demo1"));

    demo
        .setViewBox(0, 0, 500, 500)
        //.setFramerate(5)
        .setTickrate(300);
    r1 = new JSprite(new JRect(0, 0, 20, 5));
    var axe = new JSprite(new JRect(0, 0, 5, 1));
    axe.moveTo(20, 2);
    r1.addChild(axe);
    demo.root.addChild(r1);
    var r2 = r1.clone();
    demo.root.addChild(r2);
    var r3 = r2.clone();
    demo.root.addChild(r3);
    r2.moveTo(200, 0);
    //demo.root.addGraphic(new JRect(100,100,100,30));

    var keyboard = new JKeyboard();
    r1
        .setPivot(18, 2.5)
        .moveTo(50, 50, false, 2)
        .rotateTo(90, 2)
    ;
    $(".svg-container").append(demo.getRoot());

    var vitesse = 0,
        acceleration = 0.2,
        friction = 0.95,
        vrotation = 0;

    demo.on("tick", function (e, data) {
        //console.log("tick",data);
        if (keyboard.isDown(keyboard.left)) {
            vrotation -= acceleration;
        }
        if (keyboard.isDown(keyboard.right)) {
            vrotation += acceleration;
        }
        if (keyboard.isDown(keyboard.up)) {
            vitesse += acceleration;
        }
        if (keyboard.isDown(keyboard.down)) {
            vitesse -= acceleration;
        }

        vitesse *= friction;
        if (vitesse < 0) {
            vitesse *= friction;
        }
        vrotation *= friction;
        axe.rotateTo(vrotation * 10);
        r1.rotateOf(vrotation * vitesse / 3);
        r1.moveOf(0, vitesse, true);
    })

});
