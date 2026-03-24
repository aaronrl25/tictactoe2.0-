import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView, Text, Animated } from 'react-native';
import Board from './components/Board';
import Result from './components/Result';
import Menu from './components/Menu';

type Player = '✕' | '○' | null;

type GameProps = {
  mode: 'pvp' | 'pvc';
  difficulty?: 'easy' | 'hard';
  onGameEnd: (winner: Player | 'draw') => void;
  onBackToMenu: () => void;
  scores: { x: number; o: number; draws: number };
  humanPlayer: Player;
};

const Game = ({ mode, difficulty, onGameEnd, onBackToMenu, scores, humanPlayer }: GameProps) => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [player, setPlayer] = useState<Player>('✕');
  const [winner, setWinner] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [ghostIndex, setGhostIndex] = useState<number | null>(null);
  const [lastMove, setLastMove] = useState<number | null>(null);
  const glowAnim = new Animated.Value(0);
  const boardAnim = new Animated.Value(0);

  const cpuPlayer = humanPlayer === '✕' ? '○' : '✕';

  useEffect(() => {
    Animated.timing(boardAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const TurnIndicator = () => {
    if (winner || isDraw) return null;
    if (mode === 'pvc') {
      return <Text style={styles.turnText}>{player === humanPlayer ? 'Your Turn' : "CPU's Turn"}</Text>;
    }
    return <Text style={styles.turnText}>Player Turn: {player}</Text>;
  };

  useEffect(() => {
    if (winner) {
      onGameEnd(winner);
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 700,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else if (isDraw) {
      onGameEnd('draw');
    }
  }, [winner, isDraw]);

  const handlePress = (i: number, isCpuMove = false) => {
    if (board[i] || winner || (!isCpuMove && mode === 'pvc' && player === cpuPlayer)) {
      return;
    }
    const newBoard = [...board];
    newBoard[i] = player;
    setBoard(newBoard);
    setLastMove(i);
    setPlayer(player === '✕' ? '○' : '✕');
  };

  useEffect(() => {
    if (lastMove !== null) {
      const winnerCheck = calculateWinner(board, lastMove);
      if (winnerCheck) {
        setWinner(winnerCheck);
        return;
      } else if (board.every(Boolean)) {
        setIsDraw(true);
        return;
      }
    }

    if (mode === 'pvc' && player === cpuPlayer && !winner) {
      setTimeout(cpuMove, 300);
    }
  }, [board, player, winner, lastMove, mode, cpuPlayer]);

  const calculateWinner = (squares: Player[], i: number) => {
    const player = squares[i];
    if (!player) return null;

    const row = Math.floor(i / 3);
    const col = i % 3;

    if (squares[row * 3] === player && squares[row * 3 + 1] === player && squares[row * 3 + 2] === player) {
      setWinningLine([row * 3, row * 3 + 1, row * 3 + 2]);
      return player;
    }

    if (squares[col] === player && squares[col + 3] === player && squares[col + 6] === player) {
      setWinningLine([col, col + 3, col + 6]);
      return player;
    }

    if (i % 4 === 0) {
      if (squares[0] === player && squares[4] === player && squares[8] === player) {
        setWinningLine([0, 4, 8]);
        return player;
      }
    }
    if (i === 2 || i === 4 || i === 6) { // Anti-diagonal
      if (squares[2] === player && squares[4] === player && squares[6] === player) {
        setWinningLine([2, 4, 6]);
        return player;
      }
    }

    return null;
  };

  const checkWinnerForMinimax = (squares: Player[]) => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      const rowStart = i * 3;
      if (squares[rowStart] && squares[rowStart] === squares[rowStart + 1] && squares[rowStart] === squares[rowStart + 2]) {
        return squares[rowStart];
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (squares[i] && squares[i] === squares[i + 3] && squares[i] === squares[i + 6]) {
        return squares[i];
      }
    }

    // Check diagonals
    if (squares[0] && squares[0] === squares[4] && squares[0] === squares[8]) {
      return squares[0];
    }
    if (squares[2] && squares[2] === squares[4] && squares[2] === squares[6]) {
      return squares[2];
    }

    return null;
  };

  const minimax = (newBoard: Player[], currentPlayer: Player): number => {
    const winner = checkWinnerForMinimax(newBoard);
    if (winner === cpuPlayer) return 10;
    if (winner === humanPlayer) return -10;
    if (newBoard.every(Boolean)) return 0;

    const moves: number[] = [];
    const scores: number[] = [];

    newBoard.forEach((square, i) => {
      if (square === null) {
        const boardWithNewMove = [...newBoard];
        boardWithNewMove[i] = currentPlayer;
        const score = minimax(boardWithNewMove, currentPlayer === cpuPlayer ? humanPlayer : cpuPlayer);
        moves.push(i);
        scores.push(score);
      }
    });

    if (currentPlayer === cpuPlayer) {
      const maxScoreIndex = scores.indexOf(Math.max(...scores));
      return scores[maxScoreIndex];
    } else {
      const minScoreIndex = scores.indexOf(Math.min(...scores));
      return scores[minScoreIndex];
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setPlayer('✕');
    setWinner(null);
    setIsDraw(false);
    setWinningLine(null);
    setLastMove(null);
  };

  const cpuMove = () => {
    if (difficulty === 'easy') {
      const emptySquares = board.map((sq, i) => (sq === null ? i : null)).filter(i => i !== null);
      const randomMove = emptySquares[Math.floor(Math.random() * emptySquares.length)];
      handlePress(randomMove, true);
      return;
    }

    let bestScore = -Infinity;
    let move = -1;

    board.forEach((square, i) => {
      if (square === null) {
        const newBoard = [...board];
        newBoard[i] = cpuPlayer;
        const score = minimax(newBoard, humanPlayer);
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    });

    if (move !== -1) {
      handlePress(move, true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>You: {scores[humanPlayer === '✕' ? 'x' : 'o']}</Text>
        <Text style={styles.scoreText}>CPU: {scores[cpuPlayer === '○' ? 'o' : 'x']}</Text>
        <Text style={styles.scoreText}>Draws: {scores.draws}</Text>
      </View>
      <Text style={styles.title}>Tic-Tac-Toe</Text>
      <TurnIndicator />
      <Animated.View style={{ opacity: boardAnim }}>
        <Board
          board={board}
          onPressIn={i => setGhostIndex(i)}
          onPressOut={() => {
            if (ghostIndex !== null) {
              handlePress(ghostIndex);
              setGhostIndex(null);
            }
          }}
          winningLine={winningLine}
          glowAnim={glowAnim}
          ghostIndex={ghostIndex}
          player={player}
        />
      </Animated.View>
      <Result winner={winner} isDraw={isDraw} onReset={resetGame} onBackToMenu={onBackToMenu} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00008B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    color: '#fff',
    fontFamily: 'monospace',
    marginBottom: 40,
  },
  turnText: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'monospace',
    margin: 40,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'monospace',
  },
});

const App = () => {
  const [screen, setScreen] = useState('menu');
  const [mode, setMode] = useState<'pvp' | 'pvc' | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'hard' | undefined>();
  const [scores, setScores] = useState({ x: 0, o: 0, draws: 0 });
  const [humanPlayer, setHumanPlayer] = useState<Player>('✕');

  const startGame = (selectedMode: 'pvp' | 'pvc', selectedDifficulty?: 'easy' | 'hard', selectedPlayer?: Player) => {
    setMode(selectedMode);
    setDifficulty(selectedDifficulty);
    if (selectedPlayer) {
      setHumanPlayer(selectedPlayer);
    } else {
      // Reset to default if no player is selected, e.g., when switching to PvP
      setHumanPlayer('✕');
    }
    setScreen('game');
  };

  const handleGameEnd = (winner: Player | 'draw') => {
    if (winner === 'draw') {
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    } else if (winner) {
      const winnerKey = winner === '✕' ? 'x' : 'o';
      setScores(prev => ({ ...prev, [winnerKey]: prev[winnerKey] + 1 }));
    }
  };

  const backToMenu = () => {
    setScreen('menu');
    setMode(null);
  };

  return (
    <View style={styles.container}>
      {screen === 'game' && mode ? (
        <Game
          mode={mode}
          difficulty={difficulty}
          onGameEnd={handleGameEnd}
          onBackToMenu={backToMenu}
          scores={scores}
          humanPlayer={humanPlayer}
        />
      ) : (
        <Menu onStartGame={startGame} />
      )}
    </View>
  );
};

export default App;

