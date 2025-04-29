import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const data: string[] = Array.from({ length: 11 }, (_, i) => `Trang chủ ${i + 1}`);

export default function HomeScreen() {
  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  listContent: {
    paddingVertical: 16,
  },
  item: {
    flex: 1,
    backgroundColor: '#B2E0F7',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 0, // Không cần bo góc nếu bạn thích full cứng
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});