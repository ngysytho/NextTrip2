import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
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
};

export default function CartScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 🛠️ Fetch cart mỗi lần màn hình được focus
  useFocusEffect(
    useCallback(() => {
      const fetchCart = async () => {
        if (!user) return;
        setLoading(true);
        try {
          const res = await axios.get(`http://192.168.1.7:8080/api/cart/${user.userId}`);
          setCart(res.data.items);
        } catch (err) {
          console.log('❌ Lỗi fetch cart:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchCart();
    }, [user])
  );

  const clearCart = async () => {
    if (!user) return;
    try {
      await axios.post(`http://192.168.1.7:8080/api/cart/${user.userId}/clear`);
      setCart([]);
      Alert.alert('✅', 'Đã xoá giỏ hàng');
    } catch (err) {
      console.log('❌ Lỗi clear cart:', err);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Giỏ hàng của bạn ({cart.length} mục)</Text>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Giỏ hàng trống.</Text>
        </View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.placeId}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price.toLocaleString()} VNĐ</Text>
            </View>
          )}
        />
      )}

      <View style={styles.footer}>
        <Text style={styles.total}>Tổng: {total.toLocaleString()} VNĐ</Text>
        <TouchableOpacity style={styles.button} onPress={clearCart}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Xoá giỏ hàng</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace('/')}
      >
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.buttonText}>Tiếp tục mua sắm</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginVertical: 16, textAlign: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#666' },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  itemName: { fontSize: 16, color: '#222' },
  itemPrice: { fontSize: 16, color: '#FF9500' },
  footer: { paddingVertical: 16, borderTopWidth: 0.5, borderColor: '#ddd' },
  total: { fontSize: 18, fontWeight: '600', textAlign: 'right', marginBottom: 12 },
  button: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '600', marginLeft: 8 },
  backButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 16,
  },
});
