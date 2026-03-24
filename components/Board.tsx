import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Square from './Square';

type BoardProps = {
  board: ('✕' | '○' | null)[];
  onPressIn: (i: number) => void;
  onPressOut: () => void;
  winningLine: number[] | null;
  glowAnim: Animated.Value;
  ghostIndex: number | null;
  player: '✕' | '○' | null;
};

const Board = ({ board, onPressIn, onPressOut, winningLine, glowAnim, ghostIndex, player }: BoardProps) => {
  return (
    <View style={styles.board}>
      {board.map((square, i) => {
        const isWinningSquare = winningLine ? winningLine.includes(i) : false;
        return (
          <Square
            key={i}
            value={square}
            onPressIn={() => onPressIn(i)}
            onPressOut={onPressOut}
            isWinningSquare={isWinningSquare}
            glowAnim={glowAnim}
            isGhost={ghostIndex === i}
            player={player}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    width: 306,
    height: 306,
    borderWidth: 3,
    borderColor: 'white',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default Board;
