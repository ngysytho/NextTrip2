import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

type CartItem = {
  placeId: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  address: string;
  selected: boolean;
};

export default function CartScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      const fetchCart = async () => {
        if (!user) return;
        setLoading(true);
        try {
          const res = await axios.get(`http://192.168.1.7:8080/api/cart/${user.userId}`);
          const dataWithSelect = res.data.items.map((item: any) => ({
            placeId: item.placeId,
            name: item.name,
            price: item.price,
            imageUrl: item.image_url_places,
            description: item.description_places,
            address: item.address_places,
            selected: false,
          }));
          setCart(dataWithSelect);
        } catch (err) {
          console.log('❌ Lỗi fetch cart:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchCart();
    }, [user])
  );

  const toggleSelect = (placeId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.placeId === placeId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const createTrip = () => {
    const selectedItems = cart.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      Alert.alert('❌', 'Vui lòng chọn ít nhất một địa điểm để tạo chuyến đi');
      return;
    }
    router.push('/trip/create');
  };

  const aiCreateTrip = () => {
    router.push('/trip/ai-create');
  };

  const deleteSelectedItems = async () => {
    const selectedIds = cart.filter((item) => item.selected).map((item) => item.placeId);
    if (selectedIds.length === 0) {
      Alert.alert('❌', 'Vui lòng chọn ít nhất một địa điểm để xoá');
      return;
    }

    try {
      await axios.post(`http://192.168.1.7:8080/api/cart/${user.userId}/remove-multiple`, { placeIds: selectedIds });
      setCart((prev) => prev.filter((item) => !selectedIds.includes(item.placeId)));
      setIsEditing(false);
    } catch (err) {
      console.log('❌ Lỗi xoá items:', err);
      Alert.alert('❌', 'Xoá thất bại');
    }
  };

  const selectedCount = cart.filter((item) => item.selected).length;
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="arrow-back" size={24} />
        <Text style={styles.header}>Chuyến đi của bạn ({cart.length} mục)</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={styles.editText}>{isEditing ? 'Xong' : 'Sửa'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
        {cart.map((item) => (
          <View key={item.placeId} style={styles.card}>
            <TouchableOpacity onPress={() => toggleSelect(item.placeId)}>
              <Ionicons
                name={item.selected ? 'checkbox' : 'square-outline'}
                size={24}
                color="#007AFF"
              />
            </TouchableOpacity>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.address}>{item.address}</Text>
              <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
              <Text style={styles.price}>
                {item.price > 0 ? `${item.price.toLocaleString()} VNĐ` : 'Chưa cập nhật'}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <TouchableOpacity onPress={() => {
            const allSelected = cart.every((item) => item.selected);
            setCart((prev) => prev.map((item) => ({ ...item, selected: !allSelected })));
          }}>
            <Ionicons
              name={cart.every((item) => item.selected) ? 'checkbox' : 'square-outline'}
              size={24}
              color="#007AFF"
            />
          </TouchableOpacity>
          <Text style={{ marginLeft: 8 }}>Tất cả</Text>
          <Text style={styles.total}>Tổng cộng: {total > 0 ? `${total.toLocaleString()} VNĐ` : '0 VNĐ'}</Text>
        </View>

        {isEditing ? (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={deleteSelectedItems}
          >
            <Text style={styles.deleteButtonText}>Xoá</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.aiButton}
              onPress={aiCreateTrip}
            >
              <Text style={styles.buttonText}>Nhờ AI tạo chuyến đi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.createButton,
                { backgroundColor: selectedCount === 0 ? '#ccc' : '#34C759' },
              ]}
              onPress={createTrip}
              disabled={selectedCount === 0}
            >
              <Text style={styles.createButtonText}>Tạo chuyến đi</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  header: { fontSize: 18, fontWeight: 'bold' },
  editText: { fontSize: 16, color: '#007AFF' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 8,
    padding: 12,
    alignItems: 'flex-start',
  },
  image: { width: 60, height: 60, borderRadius: 8, marginLeft: 8 },
  name: { fontSize: 16, fontWeight: '600' },
  address: { fontSize: 14, color: '#555', marginTop: 4 },
  description: { fontSize: 13, color: '#777', marginTop: 4 },
  price: { fontSize: 15, color: '#FF3B30', marginTop: 6, fontWeight: '600' },
  footer: {
    position: 'absolute',
    bottom: 100, // nâng lên trên tab bar
    left: 0,
    right: 0,
    borderTopWidth: 0.5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  total: {
    marginLeft: 'auto',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aiButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  createButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  createButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
