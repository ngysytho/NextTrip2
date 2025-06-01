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
import { useAppTheme } from '../../context/ThemeContext';

export default function LoginScreen() {
    const [phoneOrEmail, setPhoneOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';

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
                await AsyncStorage.setItem('access_token', text);
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
        <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Đăng nhập</Text>

                <View style={styles.inputBox}>
                    <TextInput
                        value={phoneOrEmail}
                        onChangeText={setPhoneOrEmail}
                        placeholder="Số điện thoại hoặc Gmail"
                        placeholderTextColor={isDark ? '#888' : '#888'}
                        style={[styles.input, { color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#1a1a1a' : '#F9F9F9', borderColor: isDark ? '#444' : '#ccc' }]}
                    />

                    <View style={[
                        styles.passwordWrapper,
                        {
                            backgroundColor: isDark ? '#1a1a1a' : '#F9F9F9',
                            borderColor: isDark ? '#444' : '#ccc'
                        }
                    ]}>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Mật khẩu"
                            placeholderTextColor={isDark ? '#888' : '#888'}
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
                    >
                        <Text style={styles.loginText}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footerRow}>
                    <TouchableOpacity>
                        <Text style={[styles.footerText, { color: '#007AFF' }]}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                    <View style={styles.separator} />
                    <TouchableOpacity onPress={() => router.push('/login/signup')}>
                        <Text style={[styles.footerText, { color: '#007AFF' }]}>Đăng ký</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
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
    separator: {
        width: 20,
    },
});
