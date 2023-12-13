// Matter.js module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

// Create an engine
var engine = Engine.create(),
    world = engine.world;

// Create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    canvas: document.getElementById('myCanvas'),
    options: {
        width: 400,
        height: 400,
        wireframes: false
    }
});

// Define the square boundary dimensions
var squareTopLeftX = 0;
var squareTopLeftY = 0;
var squareSize = 400;

// Define a more varied set of convex potato shapes
var potatoes = [
    Matter.Vertices.fromPath('40 0, 60 20, 70 50, 50 70, 30 60, 10 40, 0 20'),
    Matter.Vertices.fromPath('30 10, 50 0, 70 20, 60 40, 40 60, 20 50, 10 30'),
    Matter.Vertices.fromPath('50 0, 70 10, 80 30, 70 60, 50 70, 20 60, 10 40, 0 30'),
    // More convex shapes can be added here
];

// Create the square boundary (as static bodies)
var ground = Bodies.rectangle(squareTopLeftX + squareSize / 2, squareTopLeftY + squareSize, squareSize, 20, { isStatic: true });
var leftWall = Bodies.rectangle(squareTopLeftX, squareTopLeftY + squareSize / 2, 20, squareSize, { isStatic: true });
var rightWall = Bodies.rectangle(squareTopLeftX + squareSize, squareTopLeftY + squareSize / 2, 20, squareSize, { isStatic: true });
var topWall = Bodies.rectangle(squareTopLeftX + squareSize / 2, squareTopLeftY, squareSize, 20, { isStatic: true });

// Create and position varied potato shapes within the square
var shapes = [];
var rows = 5; // Number of rows of shapes
var columns = 5; // Number of columns of shapes
for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
        var randomPotato = potatoes[Math.floor(Math.random() * potatoes.length)];
        var scale = 0.5 + Math.random(); // Random scale between 0.5 and 1.5
        var scaledPotato = randomPotato.map(function(vertex) {
            return { x: vertex.x * scale, y: vertex.y * scale };
        });
        var x = squareTopLeftX + j * (squareSize / columns) + 40; // Adjust position based on column
        var y = squareTopLeftY + i * (squareSize / rows) + 40; // Adjust position based on row
        shapes.push(Bodies.fromVertices(x, y, scaledPotato, {
            render: {
                fillStyle: 'brown',
                strokeStyle: 'brown',
                lineWidth: 1
            }
        }));
    }
}

// Add all of the bodies to the world
World.add(world, [ground, leftWall, rightWall, topWall, ...shapes]);

// Create a mouse
var mouse = Mouse.create(render.canvas);

// Create mouse constraint
var mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

// Add mouse constraint to the world
World.add(world, mouseConstraint);

// Ensure the mouse is relative to the canvas and not the entire page
render.mouse = mouse;

// Run the engine
Engine.run(engine);

// Run the renderer
Render.run(render);

// Function to export canvas as PNG
function exportCanvas() {
    var canvas = document.getElementById('myCanvas');
    var url = canvas.toDataURL("image/png");
    var link = document.createElement('a');
    link.download = 'myCanvas.png';
    link.href = url;
    link.click();
}

// Attach export function to button
document.getElementById('exportButton').addEventListener('click', exportCanvas);

