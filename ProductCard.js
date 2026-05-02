// components/ProductCard.js
import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ProductCard = ({ item, onPress, isGrid = false }) => {
  if (isGrid) {
    // ===== TAMPILAN GRID (2 kolom) =====
    return (
      <TouchableOpacity
        style={gridStyles.card}
        onPress={() => onPress(item)}
        activeOpacity={0.85}
      >
        <View style={gridStyles.imageContainer}>
          <Text style={gridStyles.emoji}>{item.image}</Text>
        </View>
        <Text style={gridStyles.category}>{item.category}</Text>
        <Text style={gridStyles.name} numberOfLines={2}>{item.name}</Text>
        <View style={gridStyles.ratingRow}>
          <Text style={gridStyles.rating}>⭐ {item.rating}</Text>
          <Text style={gridStyles.sold}>{item.sold.toLocaleString('id-ID')} terjual</Text>
        </View>
        <Text style={gridStyles.price}>
          Rp {item.price.toLocaleString('id-ID')}
        </Text>
      </TouchableOpacity>
    );
  }

  // ===== TAMPILAN LIST (1 kolom) =====
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.85}
    >
      {/* Emoji sebagai pengganti gambar */}
      <View style={styles.imageContainer}>
        <Text style={styles.emoji}>{item.image}</Text>
      </View>

      {/* Info produk */}
      <View style={styles.info}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>

        {/* Rating dan sold */}
        <View style={styles.metaRow}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={styles.sold}>{item.sold.toLocaleString('id-ID')} terjual</Text>
        </View>

        {/* Harga */}
        <Text style={styles.price}>
          Rp {item.price.toLocaleString('id-ID')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ===== STYLES LIST =====
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 5,
    padding: 14,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    width: 76,
    height: 76,
    backgroundColor: '#eef2ff',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  emoji: {
    fontSize: 38,
  },
  info: {
    flex: 1,
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6366f1',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 20,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  rating: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '700',
  },
  sold: {
    fontSize: 11,
    color: '#9ca3af',
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4f46e5',
  },
});

// ===== STYLES GRID =====
const gridStyles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#eef2ff',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 34,
  },
  category: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6366f1',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  rating: {
    fontSize: 11,
    color: '#f59e0b',
    fontWeight: '700',
  },
  sold: {
    fontSize: 10,
    color: '#9ca3af',
  },
  price: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4f46e5',
  },
});

// memo: agar card tidak re-render jika props tidak berubah
export default memo(ProductCard);