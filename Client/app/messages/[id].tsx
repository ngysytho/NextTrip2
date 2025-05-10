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

export default function ChatScreen() {
    const { name, avatar } = useLocalSearchParams();
    const [messages, setMessages] = useState<string[]>([]);
    const [text, setText] = useState('');

    const sendMessage = () => {
        if (text.trim()) {
            setMessages([...messages, text]);
            setText('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header tùy chỉnh */}
            <View style={styles.chatHeader}>
                {avatar && (
                    <Image source={{ uri: avatar as string }} style={styles.avatar} />
                )}
                <Text style={styles.headerText}>{name || 'Người lạ'}</Text>
            </View>

            <FlatList
                data={messages}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                    <View style={styles.messageBubble}>
                        <Text style={styles.messageText}>{item}</Text>
                    </View>
                )}
                contentContainerStyle={{ flexGrow: 1, padding: 16 }}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder="Nhập tin nhắn..."
                    style={styles.input}
                    placeholderTextColor="#aaa"
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Text style={styles.sendText}>Gửi</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        padding: 12,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },
    headerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    messageBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#aaa',
        borderRadius: 12,
        padding: 10,
        marginBottom: 8,
        maxWidth: '80%',
    },
    messageText: { color: '#fff' },
    inputContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#333',
        padding: 8,
        alignItems: 'center',
        backgroundColor: '#111',
    },
    input: {
        flex: 1,
        color: '#fff',
        backgroundColor: '#222',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
    },
    sendButton: {
        backgroundColor: '#007AFF',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    sendText: { color: '#fff', fontWeight: 'bold' },
});
