import React, { useState } from 'react';
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
import { useRouter, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from '../../context/ThemeContext';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { useAuth } from '../../context/AuthContext'; // ✅ import useAuth

type LoginResponse = {
  token: string;
  user: {
    userId: string;
    displayName: string;
    username: string;
    email: string;
    birthDate: string;
    gender: string;
  };
};

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { theme } = useAppTheme();
  const isDark = theme === 'dark';

  const { setUser, setToken } = useAuth(); // ✅ get setUser & setToken from context

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);

    try {
      const loginRes = await fetch('http://192.168.1.9:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_user: email.trim(),
          password_user: password,
        }),
      });

      if (!loginRes.ok) {
        const errorText = await loginRes.text();
        Alert.alert('Lỗi đăng nhập', errorText);
        return;
      }

      const loginData: LoginResponse = await loginRes.json();
      console.log('✅ loginData:', loginData);

      const user = loginData.user;

      // ✅ Validate userId
      if (!user.userId) {
        console.error('❌ userId undefined in response:', user);
        Alert.alert('Lỗi', 'Dữ liệu user không hợp lệ (thiếu userId)');
        return;
      }

      // ✅ Save token
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, loginData.token);
      setToken(loginData.token); // ✅ set token into context

      // ✅ Save user info into AsyncStorage
      await AsyncStorage.multiSet([
        ['userId', user.userId ?? ''],
        [STORAGE_KEYS.DISPLAY_NAME, user.displayName ?? ''],
        [STORAGE_KEYS.USERNAME, user.username ?? ''],
        [STORAGE_KEYS.EMAIL, user.email ?? ''],
        [STORAGE_KEYS.BIRTH_DATE, user.birthDate ?? ''],
        [STORAGE_KEYS.GENDER, String(user.gender ?? '')],
      ]);

      // ✅ SET USER IN CONTEXT
      setUser({
        userId: user.userId,
        username: user.username,
        email: user.email,
      });

      Alert.alert('Thành công', '🎉 Đăng nhập thành công!');
      router.replace('/');
    } catch (err) {
      console.error('❌ Lỗi:', err);
      Alert.alert('Lỗi', 'Không thể kết nối đến server hoặc dữ liệu sai');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
        >
          <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Đăng nhập</Text>

          <View style={styles.inputBox}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#888"
              autoCapitalize="none"
              keyboardType="email-address"
              style={[
                styles.input,
                {
                  color: isDark ? '#fff' : '#000',
                  backgroundColor: isDark ? '#1a1a1a' : '#F9F9F9',
                  borderColor: isDark ? '#444' : '#ccc',
                },
              ]}
            />

            <View
              style={[
                styles.passwordWrapper,
                {
                  backgroundColor: isDark ? '#1a1a1a' : '#F9F9F9',
                  borderColor: isDark ? '#444' : '#ccc',
                },
              ]}
            >
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Mật khẩu"
                placeholderTextColor="#888"
                secureTextEntry={!showPassword}
                style={[styles.passwordInput, { color: isDark ? '#fff' : '#000' }]}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color={isDark ? '#ccc' : '#888'}
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: isDark ? '#007AFF' : '#000' }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginText}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerRow}>
            <TouchableOpacity onPress={() => router.push('/Login/ForgotPassword')}>
              <Text style={[styles.footerText, { color: '#007AFF' }]}>Quên mật khẩu?</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity onPress={() => router.push('/Login/SignupScreen')}>
              <Text style={[styles.footerText, { color: '#007AFF' }]}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputBox: { gap: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  loginButton: {
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  separator: { width: 20 },
});
