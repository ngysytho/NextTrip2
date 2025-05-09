import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const menuItems = [
  { icon: 'pricetag-outline', label: 'Ví' },
  { icon: 'card-outline', label: 'Payment' },
  { icon: 'time-outline', label: 'Lịch sử đơn hàng' },
  { icon: 'gift-outline', label: 'Reward Credits' },
  { icon: 'storefront-outline', label: 'Ứng dụng cho chủ quán' },
  { icon: 'person-add-outline', label: 'Mời bạn bè' },
  { icon: 'mail-outline', label: 'Góp ý' },
  { icon: 'help-circle-outline', label: 'Chính sách quy định' },
  { icon: 'settings-outline', label: 'Cài đặt' },
];

export default function MoreScreen() {
  const router = useRouter();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.item}>
      <View style={styles.itemLeft}>
        <Ionicons name={item.icon} size={24} color="#007AFF" />
        <Text style={styles.itemLabel}>{item.label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header chưa đăng nhập */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => router.push('/login' as any)}
      >
        <Ionicons name="person-circle-outline" size={36} color="#fff" />
        <Text style={styles.loginText}>Đăng nhập tài khoản</Text>
        <Ionicons name="chevron-forward" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Danh sách menu */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.label}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Footer */}
      <Text style={styles.version}>Phiên bản 6.27.0</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  loginText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  item: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLabel: {
    marginLeft: 12,
    fontSize: 15,
  },
  separator: {
    height: 8,
    backgroundColor: '#f2f2f2',
  },
  version: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 16,
    fontSize: 13,
  },
});
