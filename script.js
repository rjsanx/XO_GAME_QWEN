const cells = document.querySelectorAll('.cell');
const statusMessage = document.querySelector('.status-message');
const resetButton = document.querySelector('.reset-btn');
const playerX = document.querySelector('.player-x');
const playerO = document.querySelector('.player-o');
const xScore = document.querySelector('.x-score span');
const oScore = document.querySelector('.o-score span');
const drawsScore = document.querySelector('.draws span');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let scores = { x: 0, o: 0, draws: 0 };

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const winningMessage = () => `Player ${currentPlayer} Wins!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `Player ${currentPlayer}'s Turn`;

statusMessage.innerHTML = currentPlayerTurn();

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
    clickedCell.textContent = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    
    // Update active player indicator
    if (currentPlayer === 'X') {
        playerX.classList.add('active');
        playerO.classList.remove('active');
    } else {
        playerO.classList.add('active');
        playerX.classList.remove('active');
    }
    
    statusMessage.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    let winningCombo = [];
    
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            winningCombo = winningConditions[i];
            break;
        }
    }
    
    if (roundWon) {
        statusMessage.innerHTML = winningMessage();
        statusMessage.classList.add('win', 'show');
        gameActive = false;
        
        // Highlight winning cells
        winningCombo.forEach(index => {
            cells[index].classList.add('win');
        });
        
        // Update score
        if (currentPlayer === 'X') {
            scores.x++;
            xScore.textContent = scores.x;
        } else {
            scores.o++;
            oScore.textContent = scores.o;
        }
        
        return;
    }
    
    const roundDraw = !gameState.includes('');
    if (roundDraw) {
        statusMessage.innerHTML = drawMessage();
        statusMessage.classList.add('show');
        gameActive = false;
        scores.draws++;
        drawsScore.textContent = scores.draws;
        return;
    }
    
    handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));
    
    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }
    
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusMessage.classList.remove('show', 'win');
    statusMessage.innerHTML = currentPlayerTurn();
    
    // Reset active player indicator
    playerX.classList.add('active');
    playerO.classList.remove('active');
    
    cells.forEach(cell => {
        cell.classList.remove('x', 'o', 'win');
        cell.textContent = '';
    });
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleRestartGame);