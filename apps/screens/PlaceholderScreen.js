import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlaceholderScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Coming Soon!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 22,
    color: '#888',
    fontWeight: 'bold',
  },
});

export default PlaceholderScreen;
