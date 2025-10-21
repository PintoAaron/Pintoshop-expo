import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../config/colors';

const SkeletonCard = () => (
  <View style={styles.card}>
    <View style={styles.image} />
    <View style={styles.details}>
      <View style={styles.title} />
      <View style={styles.chip} />
      <View style={styles.rating} />
      <View style={styles.priceRow}>
        <View style={styles.price} />
        <View style={styles.time} />
      </View>
    </View>
  </View>
);

const SkeletonLoader = ({ count = 5 }) => (
  <View>
    {[...Array(count)].map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.light,
  },
  details: {
    padding: 18,
  },
  title: {
    width: '60%',
    height: 18,
    backgroundColor: colors.light,
    borderRadius: 6,
    marginBottom: 10,
  },
  chip: {
    width: 80,
    height: 16,
    backgroundColor: colors.light,
    borderRadius: 8,
    marginBottom: 8,
  },
  rating: {
    width: 90,
    height: 16,
    backgroundColor: colors.light,
    borderRadius: 8,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    width: 60,
    height: 16,
    backgroundColor: colors.light,
    borderRadius: 8,
  },
  time: {
    width: 40,
    height: 16,
    backgroundColor: colors.light,
    borderRadius: 8,
  },
});

export default SkeletonLoader;
