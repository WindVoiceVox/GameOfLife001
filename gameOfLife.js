const cellSize = 22;
const gridWidth = 400;
const gridHeight = 400;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let cells = [];

// Initialize the grid
for (let y = 0; y < gridHeight; y++) {
    cells[y] = [];
    for (let x = 0; x < gridWidth; x++) {
        cells[y][x] = { alive: false };
    }
}

// Toggle cell state
function toggleCell(x, y) {
    cells[y][x].alive = !cells[y][x].alive;
    render();
}

// Count the number of alive neighbors
function countNeighbors(x, y) {
    let count = 0;

    for (let yOffset = -1; yOffset <= 1; yOffset++) {
        for (let xOffset = -1; xOffset <= 1; xOffset++) {
            if (yOffset === 0 && xOffset === 0) continue;
            const newY = y + yOffset;
            const newX = x + xOffset;

            if (newY >= 0 && newY < gridHeight && newX >= 0 && newX < gridWidth) {
                if (cells[newY][newX].alive) {
                    count++;
                }
            }
        }
    }

    return count;
}

// Update the grid for the next generation
function step() {
    const nextGen = cells.map(row => row.map(cell => ({ ...cell })));

    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const neighbors = countNeighbors(x, y);

            if (cells[y][x].alive) {
                nextGen[y][x].alive = neighbors === 2 || neighbors === 3;
            } else {
                nextGen[y][x].alive = neighbors === 3;
            }
        }
    }

    cells = nextGen;
    render();
}

// Render the grid
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            if (cells[y][x].alive) {
                ctx.fillStyle = "black";
                ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
            }
        }
    }
}

// Randomize the grid
function randomize() {
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            cells[y][x].alive = Math.random() > 0.5;
        }
    }
    render();
}

// Add click event listener to the canvas
canvas.addEventListener("click", (event) => {
    const x = Math.floor(event.clientX / cellSize);
    const y = Math.floor(event.clientY / cellSize);
    toggleCell(x, y);
});

// Add keydown event listener to the document
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        step();
        event.preventDefault(); // Avoid scrolling the page when space is pressed
    }
});

// Initialize the canvas with random cells
randomize();
