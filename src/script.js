// Initialize Chess.js for game logic
const game = new Chess();

// Initialize Chessboard.js for rendering the board
const board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDrop: handleMove,
});

// Create Stockfish instance (running as a Web Worker)
const stockfishEngine = stockfish();

// Function to handle player moves
function handleMove(source, target) {
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q', // Always promote to queen for simplicity
    });

    if (move === null) return 'snapback'; // Illegal move

    // Make AI move
    setTimeout(makeAIMove, 250);
}

// Function to make Stockfish's move
function makeAIMove() {
    if (game.game_over()) {
        alert("Game over");
        return;
    }

    // Get Stockfish's best move
    stockfishEngine.postMessage('position fen ' + game.fen());
    stockfishEngine.postMessage('go depth 15'); // Depth determines the AI's strength

    stockfishEngine.onmessage = function (event) {
        const response = event.data;
        if (response.includes('bestmove')) {
            const aiMove = response.split(' ')[1];
            game.move({
                from: aiMove.substring(0, 2),
                to: aiMove.substring(2, 4),
                promotion: 'q',
            });
            board.position(game.fen()); // Update board
        }
    };
}
