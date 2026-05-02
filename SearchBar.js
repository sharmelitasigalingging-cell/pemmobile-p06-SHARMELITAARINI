// components/SearchBar.js
import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SearchBar = ({ value, onChangeText, resultCount, totalCount }) => {
  return (
    <View style={styles.wrapper}>
      {/* Input area */}
      <View style={styles.inputContainer}>
        <Text style={styles.icon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Cari produk atau kategori..."
          placeholderTextColor="#a5b4fc"
          value={value}
          onChangeText={onChangeText}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {/* Tombol clear — muncul saat ada teks */}
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Info jumlah hasil */}
      <Text style={styles.resultInfo}>
        {value.trim()
          ? `${resultCount} hasil untuk "${value}"`
          : `${totalCount} produk tersedia`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#c7d2fe',
  },
  icon: {
    fontSize: 15,
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 14,
    color: '#1e1b4b',
    fontWeight: '500',
  },
  clearBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 13,
    color: '#818cf8',
    fontWeight: '700',
  },
  resultInfo: {
    fontSize: 12,
    color: '#6b7280',
    paddingHorizontal: 2,
  },
});

export default SearchBar;