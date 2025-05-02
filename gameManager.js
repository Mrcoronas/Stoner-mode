// STONER MODE - PlayCanvas Engine

var app = new pc.Application(document.getElementById('application-canvas'), {
    mouse: new pc.Mouse(document.body),
    touch: new pc.TouchDevice(document.body)
});

app.start();

app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);

window.addEventListener('resize', function () {
    app.resizeCanvas();
});

var camera = new pc.Entity();
camera.addComponent('camera', {
    orthographic: true,
    orthoHeight: 300,
    clearColor: new pc.Color(0.1, 0.05, 0.2)
});
camera.setPosition(0, 0, 10);
app.root.addChild(camera);

var light = new pc.Entity();
light.addComponent('light');
light.setPosition(0, 0, 2);
app.root.addChild(light);

var uiScreen = new pc.Entity();
uiScreen.addComponent('screen', {
    referenceResolution: new pc.Vec2(600, 600),
    scaleMode: pc.SCALEMODE_BLEND
});
app.root.addChild(uiScreen);

var fog = new pc.Entity();
fog.addComponent('element', {
    type: 'image',
    color: new pc.Color(0.8, 0.8, 1, 0.1),
    width: 1200,
    height: 600
});
fog.setLocalPosition(0, 0, 0);
uiScreen.addChild(fog);

var title = new pc.Entity();
title.addComponent('element', {
    type: 'text',
    text: 'STONER MODE',
    fontSize: 64,
    pivot: new pc.Vec2(0.5, 1),
    anchor: new pc.Vec4(0.5, 1, 0.5, 1),
    alignment: pc.Vec2.CENTER,
    color: new pc.Color(1, 1, 1)
});
title.setLocalPosition(0, -20, 0);
uiScreen.addChild(title);

var ball = new pc.Entity();
ball.addComponent('element', {
    type: 'image',
    color: new pc.Color(0, 1, 0),
    width: 30,
    height: 30
});
ball.addComponent('rigidbody', {
    type: 'dynamic',
    friction: 0,
    restitution: 1,
    linearDamping: 0.3,
    angularDamping: 0.8
});
ball.addComponent('collision', {
    type: 'circle',
    radius: 15
});
ball.setLocalPosition(0, 0, 0);
uiScreen.addChild(ball);

var cue = new pc.Entity();
cue.addComponent('element', {
    type: 'image',
    color: new pc.Color(1, 1, 1),
    width: 100,
    height: 5
});
cue.setLocalPosition(0, 0, 0.1);
uiScreen.addChild(cue);

function createWall(x, y, width, height) {
    var wall = new pc.Entity();
    wall.addComponent('collision', {
        type: 'box',
        halfExtents: new pc.Vec3(width / 2, height / 2, 0.5)
    });
    wall.addComponent('rigidbody', {
        type: 'static',
        friction: 0,
        restitution: 1
    });
    wall.setLocalPosition(x, y, 0);
    app.root.addChild(wall);
}

var halfW = 300;
var halfH = 300;
createWall(0, halfH, halfW * 2, 10);
createWall(0, -halfH, halfW * 2, 10);
createWall(-halfW, 0, 10, halfH * 2);
createWall(halfW, 0, 10, halfH * 2);

var rotating = true;
var cueRotationSpeed = 90;
var launched = false;

app.mouse.on(pc.EVENT_MOUSEDOWN, function () {
    if (rotating && !launched) {
        rotating = false;
        launched = true;

        var rotation = cue.getEulerAngles().z;
        var radians = pc.math.degToRad(rotation);
        var force = new pc.Vec3(Math.cos(radians) * 400, Math.sin(radians) * 400, 0);
        ball.rigidbody.applyImpulse(force);

        cue.enabled = false;
    }
});

app.on('update', function (dt) {
    if (rotating && !launched) {
        cue.rotate(0, 0, cueRotationSpeed * dt);
    }

    if (ball) {
        cue.setPosition(ball.getPosition());
    }

    if (fog) {
        var pos = fog.getLocalPosition();
        pos.x += 5 * dt;
        if (pos.x > 400) {
            pos.x = -400;
        }
        fog.setLocalPosition(pos);
    }
});


// Create 420 Collectible
var collectible = new pc.Entity();
collectible.addComponent('element', {
    type: 'text',
    text: '420',
    fontSize: 32,
    pivot: new pc.Vec2(0.5, 0.5),
    anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
    alignment: pc.Vec2.CENTER,
    color: new pc.Color(0, 1, 0)
});
collectible.addComponent('collision', {
    type: 'circle',
    radius: 20
});
collectible.addComponent('rigidbody', {
    type: 'static'
});
collectible.setLocalPosition(100, 100, 0);
uiScreen.addChild(collectible);

// Listen for collision
ball.collision.on('collisionstart', function (result) {
    if (result.other === collectible) {
        collectible.destroy();
        console.log('420 collected! You unlocked a bonus!');
    }
});