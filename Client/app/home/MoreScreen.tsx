import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import dayjs from 'dayjs';

type MenuItem = {
  icon: string;
  label: string;
  isLogout?: boolean;
  onPress?: () => void;
};

type ProfileInfo = {
  name: string;
  username: string;
  email: string;
  birth: string;
  gender: string;
  lastUpdatedProfile: string;
};

export default function MoreScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    name: '',
    username: '',
    email: '',
    birth: '',
    gender: '',
    lastUpdatedProfile: '',
  });

  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const name = await AsyncStorage.getItem(STORAGE_KEYS.DISPLAY_NAME);
      setIsLoggedIn(!!token);
      setDisplayName(name ?? '');
    };
    checkLogin();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.DISPLAY_NAME,
      STORAGE_KEYS.USERNAME,
      STORAGE_KEYS.EMAIL,
      STORAGE_KEYS.BIRTH_DATE,
      STORAGE_KEYS.GENDER,
      STORAGE_KEYS.CREATED_AT,
      STORAGE_KEYS.UPDATED_AT,
    ]);
    setIsLoggedIn(false);
    setDisplayName('');
    Alert.alert('Đăng xuất', 'Bạn đã đăng xuất thành công');
  };

  const handleViewProfile = async () => {
    try {
      const name = await AsyncStorage.getItem(STORAGE_KEYS.DISPLAY_NAME);
      const username = await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
      const email = await AsyncStorage.getItem(STORAGE_KEYS.EMAIL);
      const birth = await AsyncStorage.getItem(STORAGE_KEYS.BIRTH_DATE);
      const gender = await AsyncStorage.getItem(STORAGE_KEYS.GENDER);
      const lastUpdatedProfile = await AsyncStorage.getItem(STORAGE_KEYS.LAST_UPDATED_PROFILE) ?? '';

      setProfileInfo({
        name: name ?? 'Chưa có',
        username: username ?? 'Chưa có',
        email: email ?? 'Chưa có',
        birth: birth ?? 'Chưa có',
        gender: gender === 'MALE' ? 'Nam' : gender === 'FEMALE' ? 'Nữ' : 'Không rõ',
        lastUpdatedProfile,
      });
      setProfileModalVisible(true);
    } catch (err) {
      console.error('Lỗi khi hiển thị thông tin cá nhân:', err);
      Alert.alert('Lỗi', 'Không thể lấy thông tin cá nhân');
    }
  };

  const getMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [
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

    if (isLoggedIn) {
      items.unshift({
        icon: 'person-outline',
        label: 'Thông tin cá nhân',
        onPress: handleViewProfile,
      });
      items.push({ icon: 'log-out-outline', label: 'Đăng xuất', isLogout: true });
    }

    return items;
  };

  const renderItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      onPress={() => {
        if (item.isLogout) return handleLogout();
        if (item.onPress) return item.onPress();
      }}
      style={[styles.item, { backgroundColor: '#FFFFFF' }]}
    >
      <View style={styles.itemLeft}>
        <Ionicons
          name={item.icon as any}
          size={24}
          color={item.isLogout ? '#FF3B30' : '#000000'}
        />
        <Text
          style={[
            styles.itemLabel,
            {
              color: item.isLogout ? '#FF3B30' : '#000000',
            },
          ]}
        >
          {item.label}
        </Text>
      </View>
      {!item.isLogout && (
        <Ionicons name="chevron-forward" size={20} color="#000000" />
      )}
    </TouchableOpacity>
  );

  const canUpdateProfile = () => {
    if (!profileInfo.lastUpdatedProfile) return true;
    const diff = dayjs().diff(dayjs(profileInfo.lastUpdatedProfile), 'day');
    return diff >= 30;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <TouchableOpacity
        style={[styles.header, { backgroundColor: '#000000' }]}
        onPress={() => {
          if (!isLoggedIn) {
            router.push('/Login/LoginScreen');
          }
        }}
      >
        <Ionicons name="person-circle-outline" size={36} color="#FFFFFF" />
        <Text style={[styles.loginText, { color: '#FFFFFF' }]}>
          {isLoggedIn ? `Xin chào, ${displayName}` : 'Đăng nhập tài khoản'}
        </Text>
        {!isLoggedIn && <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />}
      </TouchableOpacity>

      <FlatList
        data={getMenuItems()}
        keyExtractor={(item) => item.label}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: '#F0F0F0' }]} />
        )}
      />

      <Text style={[styles.version, { color: '#888888' }]}>Phiên bản 1.1.0</Text>

      {/* Modal Thông tin cá nhân */}
      <Modal
        visible={profileModalVisible}
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
        transparent
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: '#FFFFFF' }]}>
            <Text style={styles.modalTitle}>Thông tin cá nhân</Text>

            {[
              { icon: 'person', text: profileInfo.name },
              { icon: 'at', text: profileInfo.username },
              { icon: 'mail', text: profileInfo.email },
              { icon: 'calendar', text: profileInfo.birth },
              { icon: 'transgender', text: profileInfo.gender },
            ].map((item, index) => (
              <View key={index} style={styles.infoRow}>
                <Ionicons name={item.icon as any} size={20} color="#000000" />
                <Text style={[styles.infoText, { color: '#000000' }]}>{item.text}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#000000' }]}
              onPress={() => {
                if (!canUpdateProfile()) {
                  const nextUpdate = dayjs(profileInfo.lastUpdatedProfile)
                    .add(30, 'day')
                    .format('DD/MM/YYYY');
                  Alert.alert('Thông báo', `Bạn chỉ có thể cập nhật sau ${nextUpdate}`);
                  return;
                }
                setProfileModalVisible(false);
                router.push('../settings/UpdateProfile');
              }}
            >
              <Text style={styles.buttonText}>Cập nhật thông tin cá nhân</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#000000' }]}
              onPress={() => {
                setProfileModalVisible(false);
                router.push('../settings/ChangePassword');
              }}
            >
              <Text style={styles.buttonText}>Thay đổi mật khẩu</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setProfileModalVisible(false)} style={styles.closeButton}>
              <Text style={{ color: 'red' }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  separator: { height: 8 },
  version: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 13,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000000',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 12,
    alignItems: 'center',
  },
});
