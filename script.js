// Create an engine
var engine = Matter.Engine.create(),
    world = engine.world;

// Create a renderer
var render = Matter.Render.create({
    element: document.body,
    engine: engine,
    canvas: document.getElementById('myCanvas'),
    options: {
        width: 800,
        height: 600,
        wireframes: false
    }
});

// Define the square boundary dimensions
var squareTopLeftX = 150;
var squareTopLeftY = 100;
var squareSize = 400;

// Define simplified, convex potato shapes
var potatoes = [
    Matter.Vertices.fromPath('40 0, 60 20, 70 50, 50 70, 30 60, 10 40, 0 20'),
    Matter.Vertices.fromPath('30 10, 50 0, 70 20, 60 40, 40 60, 20 50, 10 30'),
    // More convex shapes can be added here
];

// Create the square boundary (as static bodies)
var ground = Matter.Bodies.rectangle(squareTopLeftX + squareSize / 2, squareTopLeftY + squareSize, squareSize, 20, { isStatic: true });
var leftWall = Matter.Bodies.rectangle(squareTopLeftX, squareTopLeftY + squareSize / 2, 20, squareSize, { isStatic: true });
var rightWall = Matter.Bodies.rectangle(squareTopLeftX + squareSize, squareTopLeftY + squareSize / 2, 20, squareSize, { isStatic: true });
var topWall = Matter.Bodies.rectangle(squareTopLeftX + squareSize / 2, squareTopLeftY, squareSize, 20, { isStatic: true });

// Create and position potato shapes within the square
var shapes = [];
var rows = 5; // Number of rows of shapes
var columns = 5; // Number of columns of shapes
for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
        var randomPotato = potatoes[Math.floor(Math.random() * potatoes.length)];
        var x = squareTopLeftX + j * (squareSize / columns) + 40; // Adjust position based on column
        var y = squareTopLeftY + i * (squareSize / rows) + 40; // Adjust position based on row
        shapes.push(Matter.Bodies.fromVertices(x, y, randomPotato, {
            render: {
                fillStyle: 'brown',
                strokeStyle: 'brown',
                lineWidth: 1
            }
        }));
    }
}

// Add all of the bodies to the world
Matter.World.add(world, [ground, leftWall, rightWall, topWall, ...shapes]);

// Run the engine
Matter.Engine.run(engine);

// Run the renderer
Matter.Render.run(render);

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
