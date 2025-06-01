import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
    ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Modal
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../context/ThemeContext';

export default function SignupScreen() {
    const router = useRouter();
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';

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
                    email_user: email,
                    username_user: username,
                    password_user: password,
                    displayName_user: name,
                    birth_date: birthDate.toISOString(),
                }),
            });

            const text = await response.text();
            if (response.ok) {
                alert('Đăng ký thành công! Mã xác nhận đã gửi về email.');
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

    const handleVerifyCode = async () => {
        if (!verificationCode) {
            alert('Vui lòng nhập mã xác nhận');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://172.20.10.7:8080/api/users/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    code: verificationCode,
                }),
            });

            const text = await response.text();
            if (response.ok) {
                alert('Xác minh tài khoản thành công!');
                setShowVerifyInput(false);
                router.replace('/');
            } else {
                alert(`Lỗi xác minh: ${text}`);
            }
        } catch (err) {
            alert('Lỗi kết nối khi xác minh.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://172.20.10.7:8080/api/users/send-verification?email=${email}`);
            const text = await response.text();
            if (response.ok) {
                alert('Đã gửi lại mã xác nhận!');
                setCountdown(60);
                setCanResend(false);
            } else {
                alert('Gửi lại thất bại: ' + text);
            }
        } catch (err) {
            alert('Không gửi lại được mã xác nhận');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#000' : '#f4f6f8' }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={[styles.title, { color: isDark ? '#fff' : '#222' }]}>Đăng ký</Text>

                    <Text style={[styles.label, { color: isDark ? '#aaa' : '#888' }]}>Họ và Tên</Text>
                    <TextInput style={[styles.input, isDark && styles.inputDark]} value={name} onChangeText={setName} placeholder="Họ và tên" placeholderTextColor="#888" />

                    <Text style={[styles.label, { color: isDark ? '#aaa' : '#888' }]}>Username</Text>
                    <TextInput style={[styles.input, isDark && styles.inputDark]} value={username} onChangeText={setUsername} placeholder="Tên đăng nhập" placeholderTextColor="#888" />

                    <Text style={[styles.label, { color: isDark ? '#aaa' : '#888' }]}>Email</Text>
                    <TextInput style={[styles.input, isDark && styles.inputDark]} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" placeholderTextColor="#888" />

                    <Text style={[styles.label, { color: isDark ? '#aaa' : '#888' }]}>Mật khẩu</Text>
                    <View style={styles.passwordWrapper}>
                        <TextInput style={[styles.input, { flex: 1 }, isDark && styles.inputDark]} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} placeholder="Mật khẩu" placeholderTextColor="#888" />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                            <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={22} color="#888" />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.label, { color: isDark ? '#aaa' : '#888' }]}>Nhập lại mật khẩu</Text>
                    <View style={styles.passwordWrapper}>
                        <TextInput style={[styles.input, { flex: 1 }, isDark && styles.inputDark]} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirmPassword} placeholder="Nhập lại mật khẩu" placeholderTextColor="#888" />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                            <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={22} color="#888" />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.label, { color: isDark ? '#aaa' : '#888' }]}>Ngày sinh</Text>
                    <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={[styles.input, isDark && styles.inputDark]}>
                        <Text style={{ color: isDark ? '#fff' : '#444' }}>{birthDate.toLocaleDateString('vi-VN')}</Text>
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

            {/* Modal xác minh */}
            <Modal visible={showVerifyInput} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, isDark && { backgroundColor: '#111' }]}>
                        <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#333' }]}>Xác minh Email</Text>
                        <Text style={[styles.label, { color: isDark ? '#aaa' : '#888' }]}>Nhập mã xác nhận đã gửi tới email</Text>
                        <TextInput style={[styles.input, isDark && styles.inputDark]} value={verificationCode} onChangeText={setVerificationCode} placeholder="Mã xác nhận" keyboardType="number-pad" placeholderTextColor="#888" />

                        <TouchableOpacity onPress={handleVerifyCode} style={styles.button} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Xác minh</Text>}
                        </TouchableOpacity>

                        {canResend ? (
                            <TouchableOpacity onPress={handleResendCode} style={{ marginTop: 12 }}>
                                <Text style={{ color: '#007AFF', textAlign: 'center' }}>Gửi lại mã xác nhận</Text>
                            </TouchableOpacity>
                        ) : (
                            <Text style={{ marginTop: 12, textAlign: 'center', color: '#999' }}>
                                Bạn có thể gửi lại sau {countdown}s
                            </Text>
                        )}

                        <TouchableOpacity onPress={() => setShowVerifyInput(false)} style={styles.cancelButton}>
                            <Text style={styles.cancelButtonText}>Huỷ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 24, paddingBottom: 40 },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
    label: { fontSize: 13, marginBottom: 6, marginTop: 12 },
    input: {
        borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff',
        paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12,
        fontSize: 16, marginBottom: 4,
    },
    inputDark: {
        backgroundColor: '#222',
        color: '#fff',
        borderColor: '#555',
    },
    passwordWrapper: { flexDirection: 'row', alignItems: 'center' },
    eyeIcon: { position: 'absolute', right: 12, top: 14 },
    button: {
        backgroundColor: '#007AFF', paddingVertical: 16, borderRadius: 12,
        alignItems: 'center', marginTop: 24,
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 16,
        width: '80%',
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    cancelButton: {
        marginTop: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#007AFF',
        fontSize: 14,
    },
});
