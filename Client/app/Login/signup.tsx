import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';

export default function SignupScreen() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const handleSignUp = () => {
        if (password !== confirmPassword) {
            setPasswordError('Mật khẩu không khớp');
            return;
        }

        setPasswordError('');
        console.log({ name, username, email, password, confirmPassword, birthDate });
        // TODO: Submit to backend API
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f6f8' }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.title}>Đăng ký</Text>

                    <Text style={styles.helper}>Họ và Tên</Text>
                    <TextInput style={styles.input} placeholder="Họ và tên" value={name} onChangeText={setName} />

                    <Text style={styles.helper}>Username</Text>
                    <TextInput style={styles.input} placeholder="Tên đăng nhập" value={username} onChangeText={setUsername} />

                    <Text style={styles.helper}>Email hoặc số điện thoại</Text>
                    <TextInput style={styles.input} placeholder="Gmail" keyboardType="email-address" value={email} onChangeText={setEmail} />

                    <Text style={styles.helper}>Mật khẩu</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mật khẩu"
                        secureTextEntry
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if (confirmPassword && text !== confirmPassword) {
                                setPasswordError('Mật khẩu không khớp');
                            } else {
                                setPasswordError('');
                            }
                        }}
                    />

                    <Text style={styles.helper}>Nhập lại mật khẩu</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập lại mật khẩu"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            if (password && text !== password) {
                                setPasswordError('Mật khẩu không khớp');
                            } else {
                                setPasswordError('');
                            }
                        }}
                    />
                    {passwordError !== '' && (
                        <Text style={styles.errorText}>{passwordError}</Text>
                    )}

                    <Text style={styles.helper}>Ngày sinh</Text>
                    <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.input}>
                        <Text style={styles.dateText}>{birthDate.toLocaleDateString('vi-VN')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleSignUp} style={styles.button}>
                        <Text style={styles.buttonText}>Tạo tài khoản</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 24, paddingBottom: 40 },
    title: { fontSize: 28, fontWeight: 'bold', alignSelf: 'center', marginBottom: 24, color: '#222' },
    input: {
        borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff',
        paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12,
        fontSize: 16, marginBottom: 4,
    },
    helper: { fontSize: 13, color: '#888', marginBottom: 8, marginTop: 10, marginLeft: 4 },
    dateText: { fontSize: 16, color: '#444' },
    button: {
        backgroundColor: '#007AFF', paddingVertical: 16, borderRadius: 12,
        alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.15,
        shadowRadius: 5, elevation: 4, marginTop: 24,
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    errorText: { color: 'red', fontSize: 14, marginLeft: 4, marginTop: 4 },
});
