var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;


///////////////////////// colors //////////////////////////////////

/* gets a color from the list of colors, then makes it into the wallColor*/

var wallColors = [
    '#396250',
    '#5260DA',
    '#313553',
    '#CFCBCD',
    '#DB4924',
    '#F4A9AB',
    '#AA692F'
];

function getRandomWallColor() {
    var index = Math.floor(Math.random() * wallColors.length);
    return wallColors[index]; 
}

var wallColor = getRandomWallColor();
document.body.style.backgroundColor = wallColor;


/* gets a color from the list, checks it's not the wallColor, and makes it into shapeColor */

function getRandomShapeColor() {
    var color;
    do {
        var index = Math.floor(Math.random() * wallColors.length);
        color = wallColors[index];
    } while (color === wallColor); 
    return color;
}

var shapeColor = getRandomShapeColor();

///////////////////// engine world ////////////////////////////

var engine = Engine.create(),
    world = engine.world;

var render = Render.create({
    element: document.body,
    engine: engine,
    canvas: document.getElementById('myCanvas'),

    options: {
        width: 400,
        height: 400,
        wireframes: false,
        background: wallColor
    }
});

var squareTopLeftX = 0;
var squareTopLeftY = 0;
var squareSize = 400;
engine.world.gravity.y = 0.1;


///////////////////////// shapes + walls  //////////////////////////

var potatoes = [
    Matter.Vertices.fromPath('30 10, 50 10, 70 30, 60 60, 50 70, 30 70, 10 50, 10 30'),
    Matter.Vertices.fromPath('0 37, 3 55, 18 74, 46 71, 60 60, 67 30, 65 10, 62 4, 50 0, 32 18, 18 23'),
    Matter.Vertices.fromPath('0 30, 15 40, 68 40, 58 28, 28 18, 8 22'),
    Matter.Vertices.fromPath('0 8, 0 21, 8 32, 14 35, 23 41, 36 53, 45 58, 57 61, 68 54, 80 43, 77 28, 68 8, 58 0, 48 3, 38 3, 25 0, 3 0'),
    Matter.Vertices.fromPath('0 17, 6 31, 29 48, 53 36, 53 18, 43 6, 18 1, 7 7 '),
    Matter.Vertices.fromPath('0 10, 3 23, 18 43, 31 50, 49 47, 57 42, 59 10, 55 3, 35 2, 20 7, 8 4'),
    Matter.Vertices.fromPath('0 25, 3 37, 12 45, 25 48, 33 46, 48 45, 54 38, 55 23, 49 12, 29 9, 24 4, 11 9, 3 15')
    //Matter.Vertices.fromPath('0 8, 8 18, 20 27, 33 30, 38 18, 34 10, 27 4, 20 0, 4 0 '),
];

function flipVertices(vertices, flipH, flipV) {
    return vertices.map(vertex => {
        return {
            x: flipH ? -vertex.x : vertex.x,
            y: flipV ? -vertex.y : vertex.y
        };
    });
}

var ground = Bodies.rectangle(squareTopLeftX + squareSize / 2, squareTopLeftY + squareSize, squareSize, 100, {
    isStatic: true,
    render: {
        fillStyle: wallColor
    }
});
var leftWall = Bodies.rectangle(squareTopLeftX, squareTopLeftY + squareSize / 2, 100, squareSize, {
    isStatic: true,
    render: {
        fillStyle: wallColor
    }
});
var rightWall = Bodies.rectangle(squareTopLeftX + squareSize, squareTopLeftY + squareSize / 2, 100, squareSize, {
    isStatic: true,
    render: {
        fillStyle: wallColor
    }
});
var topWall = Bodies.rectangle(squareTopLeftX + squareSize / 2, squareTopLeftY, squareSize, 100, {
    isStatic: true,
    render: {
        fillStyle: wallColor
    }
});

var shapes = [];
var rows = 4; 
var columns = 4; 
for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
        var scale = 0.6 + Math.random();
        var flipH = Math.random() < 0.5;
        var flipV = Math.random() < 0.5;
        var randomPotato = potatoes[Math.floor(Math.random() * potatoes.length)];
        var scaledFlippedPotato = randomPotato.map(function(vertex) {
            var flippedX = flipH ? -vertex.x : vertex.x;
            var flippedY = flipV ? -vertex.y : vertex.y;
            return { x: flippedX * scale, y: flippedY * scale };
        });
        var x = squareTopLeftX + j * (squareSize / columns) + 50;
        var y = squareTopLeftY + i * (squareSize / rows) + 50;
        shapes.push(Bodies.fromVertices(x, y, scaledFlippedPotato, {
            render: {
                fillStyle: shapeColor,
                strokeStyle: wallColor,
                lineWidth: 0
            }
        }));
    }
}


World.add(world, [ground, leftWall, rightWall, topWall, ...shapes]);


////////////////////// interactivity ////////////////////


// shapes are draggable
var mouse = Mouse.create(render.canvas);

var mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

World.add(world, mouseConstraint);
render.mouse = mouse;



// right click on a shape to delete it

Matter.Events.on(mouseConstraint, 'mousedown', function(event) {
    var mouse = event.mouse;
    if (mouse.button === 2) {
        var mousePosition = mouse.position;
        var bodies = Matter.Composite.allBodies(world);

        for (var i = 0; i < bodies.length; i++) {
            if (Matter.Bounds.contains(bodies[i].bounds, mousePosition) && Matter.Vertices.contains(bodies[i].vertices, mousePosition)) {
                Matter.World.remove(world, bodies[i]);
                break;
            }
        }
    }
});

// toggle gravity

var isGravityEnabled = true;

function toggleGravity() {
    isGravityEnabled = !isGravityEnabled;
    engine.world.gravity.y = isGravityEnabled ? .2 : 0;
}

///////////////////// add new shape ///////////////////

function addShape() {
    var randomPotato = potatoes[Math.floor(Math.random() * potatoes.length)];
    var scale = 0.5 + Math.random();
    var scaledPotato = randomPotato.map(vertex => ({ x: vertex.x * scale, y: vertex.y * scale }));
    var newShape = Bodies.fromVertices(Math.random() * (300 - 100) + 100, 50, scaledPotato, { // Set the initial position
        render: {
            fillStyle: shapeColor,
            strokeStyle: wallColor,
            lineWidth: 0
        }
    });
    World.add(world, newShape);
}


///////////////////////// run //////////////////////////

Engine.run(engine);
Render.run(render);

//////////////////// making pngs ///////////////////////

function exportCanvas() {
    var originalCanvas = document.getElementById('myCanvas');
    var tempCanvas = document.createElement('canvas');
    var tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = originalCanvas.width;
    tempCanvas.height = originalCanvas.height;
    tempCtx.fillStyle = wallColor;
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(originalCanvas, 0, 0);
    var url = tempCanvas.toDataURL("image/png");
    var link = document.createElement('a');
    link.download = 'coverart.png';
    link.href = url;
    link.click();
}



//////////////////// initializing /////////////////////////

document.getElementById('resetButton').addEventListener('click', function () {
    location.reload();
});
document.getElementById('exportButton').addEventListener('click', exportCanvas);

document.getElementById('addButton').addEventListener('click', addShape);

document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

document.getElementById('toggleGravityButton').addEventListener('click', toggleGravity);



