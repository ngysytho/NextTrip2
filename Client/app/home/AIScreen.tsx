import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../context/ThemeContext';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

export default function AIScreen() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const isDark = theme === 'dark';

  const send = () => {
    if (!inputText.trim()) return;
    const userMessage: Message = { text: inputText.trim(), sender: 'user' };
    const botMessage: Message = {
      text: `Bot trả lời: "${inputText.trim()}"`,
      sender: 'bot',
    };
    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInputText('');
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.bottom + 60 : 0}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={[styles.header, { backgroundColor: isDark ? '#000' : '#fff' }]}>
          <Text style={[styles.headerText, { color: isDark ? '#fff' : '#000' }]}>TripChat</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                item.sender === 'user' ? styles.right : styles.left,
              ]}
            >
              <Text style={styles.avatar}>{item.sender === 'user' ? '🧑' : '🤖'}</Text>
              <View
                style={[
                  styles.messageBubble,
                  {
                    backgroundColor: item.sender === 'user'
                      ? (isDark ? '#222' : '#ddd')
                      : (isDark ? '#444' : '#eee'),
                  },
                ]}
              >
                <Text style={{ color: isDark ? '#fff' : '#000' }}>{item.text}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: insets.bottom + 100,
          }}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        />

        <View
          style={[
            styles.inputWrap,
            {
              backgroundColor: isDark ? '#000' : '#fff',
              paddingBottom: insets.bottom + 35,
            },
          ]}
        >
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask something..."
            placeholderTextColor={isDark ? '#aaa' : '#555'}
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#111' : '#f0f0f0',
                color: isDark ? '#fff' : '#000',
              },
            ]}
          />
          <TouchableOpacity
            onPress={send}
            style={[
              styles.sendBtn,
              {
                backgroundColor: isDark ? '#fff' : '#000',
              },
            ]}
          >
            <Ionicons name="send" size={20} color={isDark ? '#000' : '#fff'} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
    maxWidth: '85%',
  },
  left: {
    alignSelf: 'flex-start',
  },
  right: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  avatar: {
    fontSize: 18,
    marginHorizontal: 6,
  },
  messageBubble: {
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
  },
  sendBtn: {
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
