const cellSize = 20;
const gridWidth = 300;
const gridHeight = 300;

const grid = document.getElementById("grid");
// grid.style.width = `${gridWidth * cellSize}px`;
grid.style.width = `${cellSize * gridWidth}px`;
grid.style.height = `${cellSize * gridHeight}px`;

function getRuleBySelector(sele) {
    var i, j, sheets, rules, rule = null;

    // stylesheetのリストを取得
    sheets = document.styleSheets;
    for (i = 0; i < sheets.length; i++) {
        // そのstylesheetが持つCSSルールのリストを取得
        rules = sheets[i].cssRules;
        for (j = 0; j < rules.length; j++) {
            // セレクタが一致するか調べる
            if (sele === rules[j].selectorText) {
                rule = rules[j];
                break;
            }
        }
    }
    return rule;
}

var cellClass = getRuleBySelector(".cell");
cellClass.style.width = `${(cellSize / (cellSize * gridWidth)) * 100}%`;
cellClass.style.height = `${(cellSize / (cellSize * gridHeight)) * 100}%`;

let cells = [];

// Create initial grid
for (let y = 0; y < gridHeight; y++) {
    cells[y] = [];
    for (let x = 0; x < gridWidth; x++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.id = `cell-${x}-${y}`;
        cell.addEventListener("click", () => toggleCell(x, y));

        grid.appendChild(cell);
        cells[y][x] = { element: cell, alive: false };
    }
}

// Toggle cell state
function toggleCell(x, y) {
    cells[y][x].alive = !cells[y][x].alive;
    cells[y][x].element.classList.toggle("alive");
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
    setTimeout(step, 1000);
}

// Render the grid
function render() {
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            if (cells[y][x].alive) {
                cells[y][x].element.classList.add("alive");
            } else {
                cells[y][x].element.classList.remove("alive");
            }
        }
    }
}

// Randomize the grid
function randomizeGrid() {
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            if (Math.random() > 0.5) {
                toggleCell(x, y);
            }
        }
    }
}

// Start the game
function startGame() {
    randomizeGrid();
    step();
}

startGame();

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        step();
        event.preventDefault(); // Avoid scrolling the page when space is pressed
    }
});