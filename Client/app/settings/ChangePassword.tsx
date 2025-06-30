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

export default function ChangePasswordScreen() {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getEmail = async () => {
      const savedEmail = await AsyncStorage.getItem(STORAGE_KEYS.EMAIL);
      if (savedEmail) setEmail(savedEmail);
    };
    getEmail();
  }, []);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới không khớp');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://192.168.0.119:8080/api/users/change-password', { // thay 192.168.x.x bằng IP LAN
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          oldPassword,
          newPassword,
        }),
      });

      const text = await res.text();

      if (!res.ok) {
        Alert.alert('Lỗi', text);
        return;
      }

      Alert.alert('Thành công', 'Đổi mật khẩu thành công');
      router.back();
    } catch (err) {
      console.error('Lỗi đổi mật khẩu:', err);
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
        <Text style={styles.title}>Đổi mật khẩu</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu hiện tại</Text>
          <TextInput
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholder="Nhập mật khẩu cũ"
            secureTextEntry
            style={styles.input}
          />

          <Text style={styles.label}>Mật khẩu mới</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Nhập mật khẩu mới"
            secureTextEntry
            style={styles.input}
          />

          <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Nhập lại mật khẩu mới"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleChangePassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // trắng
  },
  inner: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000000', // đen
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#000000', // đen
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: '#000000', // đen
  },
  button: {
    backgroundColor: '#000000', // đen
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF', // trắng
    fontSize: 16,
    fontWeight: '600',
  },
});
// This code defines a ChangePasswordScreen component that allows users to change their password.