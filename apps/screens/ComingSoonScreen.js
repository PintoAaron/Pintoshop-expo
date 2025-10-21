import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ComingSoonScreen = ({ title }) => (
  <View style={styles.container}>
    <Text style={styles.icon}>🚧</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.text}>This feature is coming soon!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#888',
  },
});

export default ComingSoonScreen;
