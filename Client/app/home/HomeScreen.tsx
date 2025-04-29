import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window'); // Lấy chiều rộng màn hình

const data: string[] = Array.from({ length: 11 }, (_, i) => `Trang chủ ${i + 1}`); // Tạo danh sách 11 mục

export default function HomeScreen() {
  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>NextTrip</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="facebook-messenger" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* List content */}
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Nền trắng
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#ffffff', // Nền trắng
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000', // Để đúng màu đen
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
  },
  listContent: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  item: {
    width: width * 0.95,
    backgroundColor: '#B2E0F7',
    padding: 20,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
