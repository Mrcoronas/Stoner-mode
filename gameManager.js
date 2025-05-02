const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tableColor = "#228B22"; // grön biljardfärg
const ballRadius = 15;

let balls = [];
let pockets = [];

// Skapa biljardbollar i triangel (klassisk setup)
function setupBalls() {
    const startX = canvas.width / 2 + 150;
    const startY = canvas.height / 2;
    let rows = 5;
    let count = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col <= row; col++) {
            let x = startX - row * ballRadius * 1.8;
            let y = startY + (col - row / 2) * ballRadius * 2;
            balls.push({ x: x, y: y, vx: 0, vy: 0, color: "yellow" });
            count++;
            if (count >= 15) return;
        }
    }
}

// Skapa 6 hål (pockets)
function setupPockets() {
    const margin = 40;
    const pocketRadius = 25;
    pockets = [
        { x: margin, y: margin },
        { x: canvas.width / 2, y: margin },
        { x: canvas.width - margin, y: margin },
        { x: margin, y: canvas.height - margin },
        { x: canvas.width / 2, y: canvas.height - margin },
        { x: canvas.width - margin, y: canvas.height - margin },
    ];
}

function drawTable() {
    ctx.fillStyle = tableColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPockets() {
    ctx.fillStyle = "black";
    pockets.forEach(pocket => {
        ctx.beginPath();
        ctx.arc(pocket.x, pocket.y, 25, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawBalls() {
    balls.forEach(ball => {
        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function draw() {
    drawTable();
    drawPockets();
    drawBalls();
}

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

setupBalls();
setupPockets();
gameLoop();
