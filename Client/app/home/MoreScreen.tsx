import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from '../../context/ThemeContext';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const router = useRouter();

  const { theme, mode, setMode } = useAppTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('access_token');
      const name = await AsyncStorage.getItem('display_name');
      setIsLoggedIn(!!token);
      setDisplayName(name || '');
    };
    checkLogin();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['access_token', 'display_name']);
    setIsLoggedIn(false);
    setDisplayName('');
    Alert.alert('Đăng xuất thành công');
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={[styles.item, { backgroundColor: isDark ? '#111' : '#fff' }]}>
      <View style={styles.itemLeft}>
        <Ionicons name={item.icon} size={24} color="#007AFF" />
        <Text style={[styles.itemLabel, { color: isDark ? '#eee' : '#000' }]}>{item.label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={isDark ? '#888' : '#ccc'} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#f9f9f9' }]}>
      <TouchableOpacity
        style={[styles.header, { backgroundColor: isDark ? '#222' : '#000' }]}
        onPress={() => {
          if (!isLoggedIn) {
            router.push('/login');
          }
        }}
      >
        <Ionicons name="person-circle-outline" size={36} color="#fff" />
        <Text style={styles.loginText}>
          {isLoggedIn ? `Xin chào, ${displayName}` : 'Đăng nhập tài khoản'}
        </Text>
        {!isLoggedIn && <Ionicons name="chevron-forward" size={20} color="#fff" />}
      </TouchableOpacity>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.label}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: isDark ? '#111' : '#f2f2f2' }]} />
        )}
        ListHeaderComponent={
          <View style={{ padding: 16 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 8, color: isDark ? '#eee' : '#000' }}>
              Chọn chế độ hiển thị:
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {['light', 'dark', 'system'].map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setMode(m as any)}
                  style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: mode === m ? '#007AFF' : '#ccc',
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ color: mode === m ? '#007AFF' : isDark ? '#fff' : '#000' }}>
                    {m === 'light'
                      ? '☀️ Sáng'
                      : m === 'dark'
                        ? '🌙 Tối'
                        : '⚙️ Hệ thống'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
      />

      {/* Đăng xuất và phiên bản */}
      {isLoggedIn && (
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: isDark ? '#111' : '#fff' }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: '#FF3B30' }]}>Đăng xuất</Text>
        </TouchableOpacity>
      )}
      <Text style={[styles.version, { color: isDark ? '#aaa' : '#888' }]}>
        Phiên bản 1.1.0
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
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
  },
  logoutButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 13,
  },
});
