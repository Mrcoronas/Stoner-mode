window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Resize canvas to full screen
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Game variables
    let collectibles = [];
    const collectibleCount = 10;
    const collectibleRadius = 15;
    let score = 0;

    // Create random collectibles
    function createCollectibles() {
        collectibles = [];
        for (let i = 0; i < collectibleCount; i++) {
            collectibles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                collected: false
            });
        }
    }

    // Check if point is inside collectible
    function isInsideCollectible(x, y, collectible) {
        const dx = x - collectible.x;
        const dy = y - collectible.y;
        return Math.sqrt(dx * dx + dy * dy) < collectibleRadius;
    }

    // Handle click events
    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        collectibles.forEach(collectible => {
            if (!collectible.collected && isInsideCollectible(clickX, clickY, collectible)) {
                collectible.collected = true;
                score++;
            }
        });
    });

    // Game loop
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw collectibles
        collectibles.forEach(collectible => {
            if (!collectible.collected) {
                ctx.beginPath();
                ctx.arc(collectible.x, collectible.y, collectibleRadius, 0, Math.PI * 2);
                ctx.fillStyle = 'yellow';
                ctx.fill();
                ctx.closePath();
            }
        });

        // Draw score
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.fillText('Score: ' + score, 20, 40);

        requestAnimationFrame(gameLoop);
    }

    // Init game
    createCollectibles();
    gameLoop();
};
