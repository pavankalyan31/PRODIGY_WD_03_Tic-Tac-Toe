const cells = document.querySelectorAll('[data-cell]');
const status = document.getElementById('status');
const restartButton = document.getElementById('restart');
const modeSelector = document.getElementById('mode');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let gameMode = 'human'; 

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Handle cell clicks
function handleClick(event) {
    const cell = event.target;
    const index = Array.from(cells).indexOf(cell);

    // Return if the cell is already filled or game is not active
    if (board[index] || !gameActive || (gameMode === 'ai' && currentPlayer === 'O')) return;

    // Update board and cell content
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWin()) {
        status.textContent = `${currentPlayer} Wins!`;
        gameActive = false;
        return;
    }

    if (board.every(cell => cell)) {
        status.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }

    if (gameMode === 'human') {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
    } else if (gameMode === 'ai') {
        currentPlayer = 'O'; 
        status.textContent = "AI's turn";
        setTimeout(() => aiMove(), 500); 
    }
}

// Check for winning conditions
function checkWin() {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

// Make the AI move
function aiMove() {
    const availableIndices = board
        .map((cell, index) => cell === '' ? index : null)
        .filter(index => index !== null);

    // If there's only one move left, play it
    if (availableIndices.length === 1) {
        board[availableIndices[0]] = 'O';
        cells[availableIndices[0]].textContent = 'O';
    } else {
        const move = minimax(board, 'O').index;
        board[move] = 'O';
        cells[move].textContent = 'O';
    }

    if (checkWin()) {
        status.textContent = "AI Wins!";
        gameActive = false;
        return;
    }

    if (board.every(cell => cell)) {
        status.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = 'X'; 
    status.textContent = `Player ${currentPlayer}'s turn`;
}

// Minimax algorithm for AI
function minimax(newBoard, player) {
    const availableSpots = newBoard
        .map((cell, index) => cell === '' ? index : null)
        .filter(index => index !== null);

    if (checkWin()) return { score: player === 'O' ? -10 : 10 };
    if (availableSpots.length === 0) return { score: 0 };

    let bestMove;

    if (player === 'O') {
        let bestScore = -Infinity;
        for (let spot of availableSpots) {
            newBoard[spot] = 'O';
            let score = minimax(newBoard, 'X').score;
            newBoard[spot] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = spot;
            }
        }
        return { score: bestScore, index: bestMove };
    } else {
        let bestScore = Infinity;
        for (let spot of availableSpots) {
            newBoard[spot] = 'X';
            let score = minimax(newBoard, 'O').score;
            newBoard[spot] = '';
            if (score < bestScore) {
                bestScore = score;
                bestMove = spot;
            }
        }
        return { score: bestScore, index: bestMove };
    }
}

// Restart the game
function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
    gameActive = true;
    status.textContent = `Player ${currentPlayer}'s turn`;
}

// Update game mode
function updateGameMode() {
    gameMode = modeSelector.value;
    restartGame(); 
}

// Add event listeners
cells.forEach(cell => cell.addEventListener('click', handleClick));
restartButton.addEventListener('click', restartGame);
modeSelector.addEventListener('change', updateGameMode);

// Initialize the game
restartGame();
