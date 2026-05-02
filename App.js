// App.js — ShopList App Lengkap
// Fitur: FlatList, Search real-time, Filter Kategori, Toggle List/Grid, Sort, Pull-to-Refresh

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { PRODUCTS, CATEGORIES } from './data/products';
import ProductCard from './components/ProductCard';
import SearchBar from './components/SearchBar';

export default function App() {
  // ===== STATE =====
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [isGrid, setIsGrid] = useState(false);
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'price_asc' | 'price_desc' | 'rating'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // trigger re-render setelah refresh

  // ===== DERIVED DATA (useMemo) =====
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // 1. Filter by category
    if (activeCategory !== 'Semua') {
      result = result.filter(p => p.category === activeCategory);
    }

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // 3. Sort
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [searchQuery, activeCategory, sortBy, refreshKey]);

  // ===== HANDLERS =====
  const handleProductPress = useCallback((product) => {
    Alert.alert(
      product.name,
      `Kategori: ${product.category}\nHarga: Rp ${product.price.toLocaleString('id-ID')}\nRating: ⭐ ${product.rating}\nTerjual: ${product.sold.toLocaleString('id-ID')} pcs`,
      [{ text: 'Tutup', style: 'cancel' }]
    );
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshKey(prev => prev + 1); // trigger re-compute
      setIsRefreshing(false);
    }, 1500);
  }, []);

  const handleSortPress = useCallback(() => {
    Alert.alert('Urutkan Produk', 'Pilih urutan tampilan:', [
      { text: 'Default', onPress: () => setSortBy('default') },
      { text: '💰 Harga Terendah', onPress: () => setSortBy('price_asc') },
      { text: '💎 Harga Tertinggi', onPress: () => setSortBy('price_desc') },
      { text: '⭐ Rating Tertinggi', onPress: () => setSortBy('rating') },
      { text: 'Batal', style: 'cancel' },
    ]);
  }, []);

  const getSortLabel = () => {
    switch (sortBy) {
      case 'price_asc': return '💰 Termurah';
      case 'price_desc': return '💎 Termahal';
      case 'rating': return '⭐ Rating';
      default: return '⇅ Urutkan';
    }
  };

  // ===== RENDER HELPERS =====
  const renderItem = useCallback(({ item }) => (
    <ProductCard item={item} onPress={handleProductPress} isGrid={isGrid} />
  ), [isGrid, handleProductPress]);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>🛍️ ShopList</Text>
            <Text style={styles.headerSubtitle}>
              {filteredProducts.length} produk ditampilkan
            </Text>
          </View>

          {/* Tombol Toggle Grid/List */}
          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => setIsGrid(prev => !prev)}
            activeOpacity={0.8}
          >
            <Text style={styles.toggleIcon}>{isGrid ? '☰' : '⊞'}</Text>
            <Text style={styles.toggleText}>{isGrid ? 'List' : 'Grid'}</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          resultCount={filteredProducts.length}
          totalCount={PRODUCTS.length}
        />

        {/* ===== FILTER KATEGORI + SORT ===== */}
        <View style={styles.filterRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chip,
                  activeCategory === cat && styles.chipActive,
                ]}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.chipText,
                    activeCategory === cat && styles.chipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Tombol Sort */}
          <TouchableOpacity
            style={[styles.sortBtn, sortBy !== 'default' && styles.sortBtnActive]}
            onPress={handleSortPress}
            activeOpacity={0.8}
          >
            <Text style={[styles.sortText, sortBy !== 'default' && styles.sortTextActive]}>
              {getSortLabel()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ===== FLAT LIST ===== */}
      <FlatList
        key={isGrid ? 'grid' : 'list'}   // ← wajib saat ganti numColumns
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={isGrid ? 2 : 1}
        columnWrapperStyle={isGrid ? styles.columnWrapper : null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        // Pull-to-Refresh
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        // Separator (hanya saat list view)
        ItemSeparatorComponent={isGrid ? null : () => (
          <View style={styles.separator} />
        )}
        // Header list
        ListHeaderComponent={() => (
          <Text style={styles.listHeader}>
            {activeCategory === 'Semua' ? '🔥 Semua Produk' : `📦 Kategori: ${activeCategory}`}
          </Text>
        )}
        // Empty State
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? `Produk "${searchQuery}" tidak ditemukan`
                : `Tidak ada produk di kategori "${activeCategory}"`}
            </Text>
            <Text style={styles.emptyHint}>
              Coba kata kunci lain atau ubah filter kategori
            </Text>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                setSearchQuery('');
                setActiveCategory('Semua');
                setSortBy('default');
              }}
            >
              <Text style={styles.resetBtnText}>Reset Semua Filter</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7ff',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1e1b4b',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1.5,
    borderColor: '#c7d2fe',
  },
  toggleIcon: {
    fontSize: 15,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4f46e5',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    paddingRight: 12,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  chipActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    marginLeft: 8,
  },
  sortBtnActive: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  sortText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b7280',
  },
  sortTextActive: {
    color: '#b45309',
  },
  listContent: {
    paddingVertical: 12,
    paddingBottom: 36,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#ede9fe',
    marginHorizontal: 16,
  },
  listHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b7280',
    paddingHorizontal: 16,
    paddingBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 20,
  },
  resetBtn: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  resetBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
});