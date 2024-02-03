const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const setMark = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const getBoard = () => board;

    const reset = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { setMark, getBoard, reset };
})();

const Player = (name, mark) => {
    return { name, mark };
};


const GameController = (() => {
    let player1, player2;
    let currentPlayer;
    let gameIsOver = false;

    const init = (player1Name, player2Name) => {
        player1 = Player(player1Name, "X");
        player2 = Player(player2Name, "O");
        currentPlayer = player1;
        gameIsOver = false;
        DisplayController.updateResultMessage(`Current player: ${currentPlayer.name}`);
        Gameboard.reset();
        DisplayController.renderBoard();
        DisplayController.addResetHandler();
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        DisplayController.updateResultMessage(`Current player: ${currentPlayer.name}`);
    };

    const playTurn = (index) => {
        if (gameIsOver) {
            alert("The game is over. Please reset to play again.");
            return;
        }
        if (Gameboard.setMark(index, currentPlayer.mark)) {
            DisplayController.renderBoard();
            if (checkWin()) {
                DisplayController.updateResultMessage(`${currentPlayer.name} wins!`, true);
                gameIsOver = true;
                return;
            }
            if (checkTie()) {
                DisplayController.updateResultMessage(`It's a tie!`);
                gameIsOver = true; 
                return;
            }
            switchPlayer();
        }
    };

    const checkWin = () => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        return winConditions.some(condition => {
            return condition.every(index => {
                return Gameboard.getBoard()[index] === currentPlayer.mark;
            });
        });
    };

    const checkTie = () => {
        return Gameboard.getBoard().every(mark => mark !== "");
    };

    const resetGame = () => {
        Gameboard.reset();
        currentPlayer = player1;
        gameIsOver = false;
        DisplayController.renderBoard();
        DisplayController.updateResultMessage(`Current player: ${currentPlayer.name}`);
    };

    return { playTurn, resetGame, init };
})();

const DisplayController = (() => {
    const renderBoard = () => {
        const boardContainer = document.getElementById('board');
        boardContainer.innerHTML = '';
        Gameboard.getBoard().forEach((mark, index) => {
            const square = document.createElement('div');
            square.textContent = mark;
            square.addEventListener('click', () => GameController.playTurn(index));
            boardContainer.appendChild(square);
        });
    };

    const addResetHandler = () => {
        document.getElementById('reset').addEventListener('click', GameController.resetGame);
    };

    const updateResultMessage = (message, isWin = false) => {
        const winnerText = document.getElementById('winner');
        winnerText.textContent = message;
        if (isWin) {
            winnerText.classList.add("winner-animation");
        } else {
            winnerText.classList.remove("winner-animation");
        }
    };

    return { renderBoard, addResetHandler, updateResultMessage };
})();

document.addEventListener("DOMContentLoaded", () => {
    const player1Name = prompt("Enter name for Player 1 (X):", "Player 1") || "Player 1";
    const player2Name = prompt("Enter name for Player 2 (O):", "Player 2") || "Player 2";
    GameController.init(player1Name, player2Name);
    DisplayController.addResetHandler();
});
