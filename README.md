# Tic-Tac-Toe

A simple, unbeatable single-player Tic-Tac-Toe game built with Expo, React Native, and TypeScript.

## How to Play

- You are ✕ and the CPU is ○.
- Tap on a square to make your move.
- The CPU will make its move after a 300ms delay.
- The first player to get three in a row wins.
- If all squares are filled and there is no winner, the game is a draw.

## How to Run

1.  Install the dependencies:

    ```
    npm install
    ```

2.  Start the Expo development server:

    ```
    npx expo start
    ```

3.  To run on the iOS Simulator:

    ```
    npx expo run:ios
    ```

## Minimax Algorithm

The CPU uses the Minimax algorithm to make its moves. Minimax is a recursive algorithm that is used in decision making and game theory to find the optimal move for a player, assuming that your opponent also plays optimally.

In the context of Tic-Tac-Toe, the algorithm works as follows:

1.  It considers all the possible moves from the current state of the board.
2.  For each move, it recursively calls itself to evaluate the score of the resulting board state.
3.  The scores are assigned as follows:
    -   +10 if the CPU wins.
    -   -10 if the player wins.
    -   0 for a draw.
4.  The algorithm then chooses the move that maximizes the score for the CPU, assuming the player will always choose the move that minimizes the score for the CPU.

This ensures that the CPU always makes the best possible move and is therefore unbeatable.

