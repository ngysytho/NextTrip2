import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter, Stack } from 'expo-router';
import { useAppTheme } from '../../context/ThemeContext';

export default function SignupScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const isDark = theme === 'dark';

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [gender, setGender] = useState('MALE');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerifyInput, setShowVerifyInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (showVerifyInput) {
      setCountdown(60);
      setCanResend(false);
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showVerifyInput]);

  const handleSignUp = async () => {
    const today = new Date();
    const minBirthDate = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate());
    const trimmedContact = contact.trim();
    const isEmail = /^\S+@\S+\.\S+$/.test(trimmedContact);

    if (!name || !username || !contact || !password || !confirmPassword) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (!isEmail) {
      alert('Vui lòng nhập đúng định dạng email');
      return;
    }
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp');
      return;
    }
    if (birthDate > minBirthDate) {
      alert('Bạn phải từ 12 tuổi trở lên để đăng ký');
      return;
    }

    setLoading(true);

    try {
      const body = {
        username_user: username.trim(),
        password_user: password,
        displayName_user: name.trim(),
        birth_date_user: birthDate.toISOString(),
        gender_user: gender,
        email_user: trimmedContact,
      };

      const response = await fetch('http://192.168.1.6:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const text = await response.text();
      const isUnverified = text.toLowerCase().includes('chưa xác minh');

      if (response.ok || isUnverified) {
        alert('Đăng ký thành công! Mã xác nhận đã gửi về email');
        setShowVerifyInput(true);
      } else {
        alert(`Lỗi: ${text}`);
      }
    } catch (err) {
      console.error(err);
      alert('Không kết nối được server hoặc lỗi mạng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff' }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Đăng ký</Text>

            {/* Họ và Tên */}
            <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Họ và Tên</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={name}
              onChangeText={setName}
              placeholder="Họ và tên"
              placeholderTextColor="#666"
            />

            {/* Username */}
            <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Username</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={username}
              onChangeText={setUsername}
              placeholder="Tên đăng nhập"
              placeholderTextColor="#666"
              autoCapitalize="none"
            />

            {/* Email */}
            <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Email</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={contact}
              onChangeText={setContact}
              placeholder="Email"
              keyboardType="email-address"
              placeholderTextColor="#666"
              autoCapitalize="none"
            />

            {/* Mật khẩu */}
            <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Mật khẩu</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, { flex: 1 }, isDark && styles.inputDark]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="Mật khẩu"
                placeholderTextColor="#666"
                autoComplete="off"
                textContentType="none"
                importantForAutofill="no"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={22} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Nhập lại mật khẩu */}
            <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Nhập lại mật khẩu</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, { flex: 1 }, isDark && styles.inputDark]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor="#666"
                autoComplete="off"
                textContentType="none"
                importantForAutofill="no"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={22} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Ngày sinh */}
            <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Ngày sinh</Text>
            <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={[styles.input, isDark && styles.inputDark, { justifyContent: 'center' }]}>
              <Text style={{ color: isDark ? '#fff' : '#000' }}>{birthDate.toLocaleDateString('vi-VN')}</Text>
            </TouchableOpacity>
            {isDatePickerVisible && (
              <DateTimePicker
                value={birthDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setDatePickerVisibility(false);
                  if (selectedDate) setBirthDate(selectedDate);
                }}
              />
            )}

            {/* Giới tính */}
            <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Giới tính</Text>
            <View style={[styles.input, isDark && styles.inputDark, { height: 50, justifyContent: 'center', overflow: 'hidden', paddingHorizontal: 0 }]}>
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={{ width: '100%', color: isDark ? '#fff' : '#000', transform: [{ scaleY: 0.85 }] }}
                dropdownIconColor={isDark ? '#fff' : '#000'}
                itemStyle={{ fontSize: 14, textAlign: 'left' }}
              >
                <Picker.Item label="Nam" value="MALE" />
                <Picker.Item label="Nữ" value="FEMALE" />
                <Picker.Item label="Khác" value="OTHER" />
              </Picker>
            </View>

            {/* Button đăng ký */}
            <TouchableOpacity onPress={handleSignUp} style={styles.button} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Tạo tài khoản</Text>}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  label: { fontSize: 13, marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1, borderColor: '#ccc', backgroundColor: '#fff',
    paddingVertical: Platform.OS === 'android' ? 8 : 14,
    paddingHorizontal: 16, borderRadius: 12, fontSize: 16, marginBottom: 4, height: 50,
  },
  inputDark: { backgroundColor: '#111', color: '#fff', borderColor: '#444' },
  passwordWrapper: { flexDirection: 'row', alignItems: 'center' },
  eyeIcon: { position: 'absolute', right: 12, top: 14 },
  button: {
    backgroundColor: '#000', paddingVertical: 16, borderRadius: 12,
    alignItems: 'center', marginTop: 24,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
