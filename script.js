var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

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
var shapeColor = getRandomShapeColor();

function getRandomShapeColor() {
    var color;
    do {
        var index = Math.floor(Math.random() * wallColors.length);
        color = wallColors[index];
    } while (color === wallColor); 
    return color;
}

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

var potatoes = [
    Matter.Vertices.fromPath('40 0, 60 20, 70 50, 50 70, 30 60, 10 40, 0 20'),
    Matter.Vertices.fromPath('30 10, 50 0, 70 20, 60 40, 40 60, 20 50, 10 30'),
    //Matter.Vertices.fromPath('10 0, 70 10, 80 30, 70 60, 50 70, 20 60, 10 40, 0 30'),
    Matter.Vertices.fromPath('20 20, 40 10, 60 20, 70 40, 60 60, 40 70, 20 60, 10 40'),
    Matter.Vertices.fromPath('30 10, 50 10, 70 30, 60 60, 50 70, 30 70, 10 50, 10 30'),
    Matter.Vertices.fromPath('50 0, 85 20, 100 50, 85 80, 50 100, 15 80, 0 50, 15 20'),
];

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
        var randomPotato = potatoes[Math.floor(Math.random() * potatoes.length)];
        var scale = 0.55 + Math.random(); 
        var scaledPotato = randomPotato.map(function(vertex) {
            return { x: vertex.x * scale, y: vertex.y * scale };
        });
        //var shapeColor = getRandomShapeColor(); // Get a random color for each shape
        var x = squareTopLeftX + j * (squareSize / columns) + 40;
        var y = squareTopLeftY + i * (squareSize / rows) + 40;
        shapes.push(Bodies.fromVertices(x, y, scaledPotato, {
            render: {
                fillStyle: shapeColor,
                strokeStyle: wallColor,
                lineWidth: 5
            }
        }));
    }
}

World.add(world, [ground, leftWall, rightWall, topWall, ...shapes]);

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

Engine.run(engine);
Render.run(render);

function exportCanvas() {
    var canvas = document.getElementById('myCanvas');
    var url = canvas.toDataURL("image/png");
    var link = document.createElement('a');
    link.download = 'myCanvas.png';
    link.href = url;
    link.click();
}

document.getElementById('resetButton').addEventListener('click', function () {
    location.reload();
});
document.getElementById('exportButton').addEventListener('click', exportCanvas);