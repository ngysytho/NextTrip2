import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
    ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        const today = new Date();
        const minBirthDate = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate());

        if (!name || !username || !email || !password || !confirmPassword) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            alert('Email không hợp lệ');
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
            const response = await fetch('http://172.20.10.7:8080/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    username,
                    email,
                    password,
                    birthDate: birthDate.toISOString(),
                }),
            });

            const text = await response.text(); // dùng .text() thay vì .json() để tránh lỗi parse khi backend trả về chuỗi
            console.log('📦 RESPONSE:', response.status, text);

            if (response.ok) {
                alert('Đăng ký thành công!');
                router.replace('/');
            } else {
                alert(`Lỗi: ${text}`);
            }
        } catch (err) {
            console.error('❌ LỖI FETCH:', err);
            alert('Không kết nối được server hoặc lỗi mạng.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f6f8' }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.title}>Đăng ký</Text>

                    <Text style={styles.label}>Họ và Tên</Text>
                    <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Họ và tên" />

                    <Text style={styles.label}>Username</Text>
                    <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Tên đăng nhập" />

                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />

                    <Text style={styles.label}>Mật khẩu</Text>
                    <View style={styles.passwordWrapper}>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            placeholder="Mật khẩu"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                            <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={22} color="#888" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Nhập lại mật khẩu</Text>
                    <View style={styles.passwordWrapper}>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            placeholder="Nhập lại mật khẩu"
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                            <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={22} color="#888" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Ngày sinh</Text>
                    <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.input}>
                        <Text style={styles.dateText}>{birthDate.toLocaleDateString('vi-VN')}</Text>
                    </TouchableOpacity>
                    {isDatePickerVisible && (
                        <DateTimePicker
                            value={birthDate}
                            mode="date"
                            display={Platform.OS === 'android' ? 'spinner' : 'default'}
                            maximumDate={new Date()}
                            onChange={(event, selectedDate) => {
                                if (Platform.OS === 'android') setDatePickerVisibility(false);
                                if (selectedDate) setBirthDate(selectedDate);
                            }}
                        />
                    )}

                    <TouchableOpacity onPress={handleSignUp} style={styles.button} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Tạo tài khoản</Text>}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 24, paddingBottom: 40 },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24, color: '#222' },
    label: { fontSize: 13, color: '#888', marginBottom: 6, marginTop: 12 },
    input: {
        borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff',
        paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12,
        fontSize: 16, marginBottom: 4,
    },
    passwordWrapper: { flexDirection: 'row', alignItems: 'center' },
    eyeIcon: { position: 'absolute', right: 12, top: 14 },
    dateText: { fontSize: 16, color: '#444' },
    button: {
        backgroundColor: '#007AFF', paddingVertical: 16, borderRadius: 12,
        alignItems: 'center', marginTop: 24,
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
