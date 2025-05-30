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
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
    const [phoneOrEmail, setPhoneOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleLogin = async () => {
        if (!phoneOrEmail || !password) {
            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://172.20.10.7:8080/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email_user: phoneOrEmail,
                    password_user: password,
                }),
            });

            const text = await response.text();
            if (response.ok) {
                await AsyncStorage.setItem('access_token', text); // giả sử backend trả token
                Alert.alert('Thành công', 'Đăng nhập thành công');
                router.replace('/');
            } else {
                Alert.alert('Lỗi đăng nhập', text);
            }
        } catch (err) {
            console.error('❌ Lỗi mạng:', err);
            Alert.alert('Lỗi', 'Không thể kết nối đến server');
        } finally {
            setLoading(false);
        }
    };
    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <Text style={styles.title}>Đăng nhập</Text>

                <View style={styles.inputBox}>
                    <TextInput
                        value={phoneOrEmail}
                        onChangeText={setPhoneOrEmail}
                        placeholder="Số điện thoại hoặc Gmail"
                        placeholderTextColor="#888"
                        style={styles.input}
                    />

                    <View style={styles.passwordWrapper}>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Mật khẩu"
                            placeholderTextColor="#888"
                            secureTextEntry={!showPassword}
                            style={styles.passwordInput}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={22}
                                color="#888"
                                style={{ marginLeft: 8 }}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                    >
                        <Text style={styles.loginText}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footerRow}>
                    <TouchableOpacity>
                        <Text style={styles.footerText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                    <View style={styles.separator} />
                    <TouchableOpacity onPress={() => router.push('/login/signup')}>
                        <Text style={styles.footerText}>Đăng ký</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
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
    inputBox: {
        gap: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#F9F9F9',
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#F9F9F9',
        paddingHorizontal: 12,
    },
    passwordInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 12,
        color: '#000',
    },
    loginButton: {
        backgroundColor: '#000',
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
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '500',
    },
    separator: {
        width: 20,
    },
});
