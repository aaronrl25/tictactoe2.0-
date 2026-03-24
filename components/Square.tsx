import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

type SquareProps = {
  value: '✕' | '○' | null;
  onPressIn: () => void;
  onPressOut: () => void;
  isWinningSquare: boolean;
  glowAnim: Animated.Value;
  isGhost: boolean;
  player: '✕' | '○' | null;
};

const Square = ({ value, onPressIn, onPressOut, isWinningSquare, glowAnim, isGhost, player }: SquareProps) => {
  const color = value === '✕' ? '#ADD8E6' : '#fff';

  const animatedStyle = {
    textShadowColor: color,
    textShadowRadius: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 20],
    }),
    textShadowOffset: { width: 0, height: 0 },
  };

  const ghostPlayer = isGhost && !value ? player : null;
  const ghostColor = ghostPlayer === '✕' ? '#ADD8E6' : '#fff';

  return (
    <TouchableOpacity style={styles.square} onPressIn={onPressIn} onPressOut={onPressOut}>
      {ghostPlayer && <Text style={[styles.squareText, { color: ghostColor, opacity: 0.3 }]}>{ghostPlayer}</Text>}
      {!ghostPlayer && (
        <Animated.Text style={[styles.squareText, { color }, isWinningSquare && animatedStyle]}>
          {value}
        </Animated.Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  square: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareText: {
    fontSize: 64,
    fontFamily: 'monospace',
  },
});

export default Square;
