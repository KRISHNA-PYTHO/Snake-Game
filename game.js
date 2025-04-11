const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 }     
];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameInterval;
let gameSpeed = 100;
let gameRunning = false;

highScoreElement.textContent = highScore;

function drawGame() {
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
}

function drawSnake() {
    snake.forEach((segment, index) => {
        // Gradient color for snake body
        const hue = (index * 2) % 360;
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        
        // Round corners for snake segments
        ctx.beginPath();
        ctx.roundRect(
            segment.x * gridSize, 
            segment.y * gridSize, 
            gridSize - 2, 
            gridSize - 2,
            5
        );
        ctx.fill();

        // Draw eyes if it's the head
        if (index === 0) {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(
                segment.x * gridSize + gridSize * 0.3,
                segment.y * gridSize + gridSize * 0.3,
                2, 0, Math.PI * 2
            );
            ctx.arc(
                segment.x * gridSize + gridSize * 0.7,
                segment.y * gridSize + gridSize * 0.3,
                2, 0, Math.PI * 2
            );
            ctx.fill();
        }
    });
}

function drawFood() {
    // Pulsing effect for food
    const pulse = Math.sin(Date.now() / 200) * 0.1 + 0.9;
    const size = gridSize * pulse;
    
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize/2,
        food.y * gridSize + gridSize/2,
        size/2,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Glow effect
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;
}

function clearCanvas() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid pattern
    ctx.strokeStyle = '#2a2a4e';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

function gameOver() {
    clearInterval(gameInterval);
    gameRunning = false;

    // Visual effect for game over
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '30px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 40);
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreElement.textContent = highScore;
        
        // Send score to server - fixed URL
        fetch('http://127.0.0.1:5000/api/scores/', {  // Added trailing slash
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                score: score,
                date: new Date().toISOString()
            })
        }).catch(error => console.error('Error sending score:', error));
    }
    startBtn.textContent = 'Play Again';
    startBtn.style.display = 'block';
}

// Update the fetch URL in updateHighScores as well
async function updateHighScores() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/scores/');  // Added trailing slash
        const scores = await response.json();
        if (scores.length > 0) {
            highScore = scores[0].score;
            highScoreElement.textContent = highScore;
        }
    } catch (error) {
        console.error('Error fetching high scores:', error);
    }
}

// Call updateHighScores when game loads
updateHighScores();

// Make sure canvas and context are properly initialized
// Remove these duplicate declarations since they're already defined at the top
// const canvas = document.getElementById('gameCanvas');
// if (!canvas) {
//     console.error('Canvas element not found!');
// }
// const ctx = canvas.getContext('2d');
// if (!ctx) {
//     console.error('Could not get canvas context!');
// }

// Remove duplicate gameRunning and gameInterval declarations
// let gameRunning = false;
// let gameInterval = null;

function moveSnake() {
    if (!gameRunning) return;
    
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // Wrap around screen edges
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;
    
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
        // Increase speed slightly with each food eaten
        gameSpeed = Math.max(50, gameSpeed - 5);
        clearInterval(gameInterval);
        gameInterval = setInterval(drawGame, gameSpeed);
    } else {
        snake.pop();
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function startGame() {
    if (gameRunning) return;
    
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    generateFood();
    
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    
    gameRunning = true;
    startBtn.style.display = 'none';
    // Increase initial movement speed
    gameSpeed = 150;
    gameInterval = setInterval(drawGame, gameSpeed);
    
    // Set initial direction
    dx = 1; // Start moving right
    dy = 0;
    
    drawGame();
}

document.addEventListener('keydown', (event) => {
    if (!gameRunning) return;
    
    switch (event.key) {
        case 'ArrowUp':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
});

function moveSnake() {
    if (!gameRunning) return;
    
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // Wrap around screen edges
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;
    
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
        // Increase speed slightly with each food eaten
        gameSpeed = Math.max(50, gameSpeed - 5);
        clearInterval(gameInterval);
        gameInterval = setInterval(drawGame, gameSpeed);
    } else {
        snake.pop();
    }
}

// Remove duplicate startBtn initialization since it's already defined at the top
// const startBtn = document.getElementById('startBtn');
// if (!startBtn) {
//     console.error('Start button not found!');
// }

// Make sure we only add the event listener once
startBtn.removeEventListener('click', startGame);
startBtn.addEventListener('click', startGame);

// Initial setup
clearCanvas();
drawGame();

// Add smooth transitions to canvas
canvas.style.transition = 'opacity 0.3s ease';


function checkCollision() {
    const head = snake[0];
    
    // Check for self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }
    
    // Check for wall collision (optional since we have wrap-around)
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
    }
}
// ... existing code ...

// Add touch controls
document.getElementById('upBtn').addEventListener('click', () => {
    if (direction !== 'down') direction = 'up';
});

document.getElementById('downBtn').addEventListener('click', () => {
    if (direction !== 'up') direction = 'down';
});

document.getElementById('leftBtn').addEventListener('click', () => {
    if (direction !== 'right') direction = 'left';
});

document.getElementById('rightBtn').addEventListener('click', () => {
    if (direction !== 'left') direction = 'right';
});

// Add touch swipe support
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', (e) => {
    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;
    
    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction !== 'left') {
            direction = 'right';
        } else if (deltaX < 0 && direction !== 'right') {
            direction = 'left';
        }
    } else {
        if (deltaY > 0 && direction !== 'up') {
            direction = 'down';
        } else if (deltaY < 0 && direction !== 'down') {
            direction = 'up';
        }
    }
});
