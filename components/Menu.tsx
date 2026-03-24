import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type MenuProps = {
  onStartGame: (mode: 'pvp' | 'pvc', difficulty?: 'easy' | 'hard', player?: '✕' | '○') => void;
};

const Menu = ({ onStartGame }: MenuProps) => {
  const [step, setStep] = useState('mode'); // 'mode', 'difficulty', 'player'
  const [mode, setMode] = useState<'pvp' | 'pvc'>('pvc');
  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('hard');

  const handleStart = (player: '✕' | '○') => {
    onStartGame(mode, difficulty, player);
  };

  if (step === 'player') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Choose Your Symbol</Text>
        <TouchableOpacity onPress={() => handleStart('✕')} style={styles.button}>
          <Text style={styles.buttonText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStart('○')} style={styles.button}>
          <Text style={styles.buttonText}>○</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 'difficulty') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Select Difficulty</Text>
        <TouchableOpacity
          onPress={() => {
            setDifficulty('easy');
            setStep('player');
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setDifficulty('hard');
            setStep('player');
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Hard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic-Tac-Toe</Text>
      <TouchableOpacity
        onPress={() => {
          setMode('pvp');
          onStartGame('pvp');
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Player vs. Player</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setMode('pvc');
          setStep('difficulty');
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Player vs. CPU</Text>
      </TouchableOpacity>
    </View>
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
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 25,
    marginBottom: 20,
    minWidth: 200,
    alignItems: 'center',
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

export default Menu;
