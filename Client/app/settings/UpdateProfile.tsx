import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';

export default function UpdateProfileScreen() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const savedEmail = await AsyncStorage.getItem(STORAGE_KEYS.EMAIL);
      const savedDisplayName = await AsyncStorage.getItem(STORAGE_KEYS.DISPLAY_NAME);
      const savedUsername = await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
      const savedBirth = await AsyncStorage.getItem(STORAGE_KEYS.BIRTH_DATE);
      const savedGender = await AsyncStorage.getItem(STORAGE_KEYS.GENDER);

      setEmail(savedEmail ?? '');
      setDisplayName(savedDisplayName ?? '');
      setUsername(savedUsername ?? '');
      setBirth(savedBirth ?? '');
      setGender(savedGender ?? '');
    };
    loadProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!displayName || !username || !birth || !gender) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://192.168.1.6:8080/api/users/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          displayName,
          username,
          birth,
          gender,
        }),
      });

      const text = await res.text();

      if (!res.ok) {
        Alert.alert('Lỗi', text);
        return;
      }

      // Lưu vào AsyncStorage
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.DISPLAY_NAME, displayName],
        [STORAGE_KEYS.USERNAME, username],
        [STORAGE_KEYS.BIRTH_DATE, birth],
        [STORAGE_KEYS.GENDER, gender],
      ]);

      Alert.alert('Thành công', 'Cập nhật thông tin thành công');
      router.back();
    } catch (err) {
      console.error('Lỗi cập nhật profile:', err);
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inner}
      >
        <Text style={styles.title}>Cập nhật thông tin cá nhân</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Họ tên</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Nhập họ tên"
            style={styles.input}
          />

          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Nhập username"
            style={styles.input}
          />

          <Text style={styles.label}>Ngày sinh (YYYY-MM-DD)</Text>
          <TextInput
            value={birth}
            onChangeText={setBirth}
            placeholder="YYYY-MM-DD"
            style={styles.input}
          />

          <Text style={styles.label}>Giới tính (MALE/FEMALE)</Text>
          <TextInput
            value={gender}
            onChangeText={setGender}
            placeholder="Nam hoặc Nữ"
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdateProfile}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Đang xử lý...' : 'Cập nhật'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  inner: { flex: 1, padding: 24 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000000',
  },
  inputGroup: { marginBottom: 24 },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: '#000000',
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
