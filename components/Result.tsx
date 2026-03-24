import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type ResultProps = {
  winner: '✕' | '○' | null;
  isDraw: boolean;
  onReset: () => void;
  onBackToMenu: () => void;
};

const Result = ({ winner, isDraw, onReset, onBackToMenu }: ResultProps) => {
  if (!winner && !isDraw) {
    return null;
  }

  return (
    <View style={styles.resultContainer}>
      <Text style={styles.resultText}>{winner ? `Winner: ${winner}` : "It's a draw!"}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onReset} style={styles.button}>
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBackToMenu} style={styles.button}>
          <Text style={styles.buttonText}>Back to Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 32,
    color: '#fff',
    fontFamily: 'monospace',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#00008B',
    fontFamily: 'monospace',
  },
});

export default Result;
