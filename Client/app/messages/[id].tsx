import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    FlatList,
    Image,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '../../context/ThemeContext'; // ✅ Dark mode

export default function ChatScreen() {
    const { name, avatar } = useLocalSearchParams();
    const [messages, setMessages] = useState<string[]>([]);
    const [text, setText] = useState('');

    const { theme } = useAppTheme();
    const isDark = theme === 'dark';

    const sendMessage = () => {
        if (text.trim()) {
            setMessages([...messages, text]);
            setText('');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            {/* Header tùy chỉnh */}
            <View style={[styles.chatHeader, { backgroundColor: isDark ? '#111' : '#f5f5f5' }]}>
                {avatar && (
                    <Image source={{ uri: avatar as string }} style={styles.avatar} />
                )}
                <Text style={[styles.headerText, { color: isDark ? '#fff' : '#000' }]}>
                    {name || 'Người lạ'}
                </Text>
            </View>

            <FlatList
                data={messages}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.messageBubble, { backgroundColor: isDark ? '#444' : '#ddd' }]}>
                        <Text style={[styles.messageText, { color: isDark ? '#fff' : '#000' }]}>{item}</Text>
                    </View>
                )}
                contentContainerStyle={{ flexGrow: 1, padding: 16 }}
            />

            <View style={[styles.inputContainer, { backgroundColor: isDark ? '#111' : '#f2f2f2', borderColor: isDark ? '#222' : '#ccc' }]}>
                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder="Nhập tin nhắn..."
                    placeholderTextColor={isDark ? '#888' : '#aaa'}
                    style={[
                        styles.input,
                        {
                            backgroundColor: isDark ? '#222' : '#fff',
                            color: isDark ? '#fff' : '#000',
                        },
                    ]}
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Text style={styles.sendText}>Gửi</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    messageBubble: {
        alignSelf: 'flex-end',
        borderRadius: 12,
        padding: 10,
        marginBottom: 8,
        maxWidth: '80%',
    },
    messageText: {},
    inputContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        padding: 8,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
        fontSize: 14,
    },
    sendButton: {
        backgroundColor: '#007AFF',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    sendText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
