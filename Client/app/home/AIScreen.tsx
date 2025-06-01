import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAppTheme } from '../../context/ThemeContext'; // ✅ THÊM DÒNG NÀY

export default function AIScreen() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const tabBarHeight = useBottomTabBarHeight();

  const { theme } = useAppTheme(); // ✅ LẤY THEME
  const isDark = theme === 'dark';

  const send = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [...prev, inputText]);
    setInputText('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#111' : '#fff' }]}>
        <Text style={[styles.headerText, { color: isDark ? '#fff' : '#000' }]}>TripChat</Text>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, { backgroundColor: isDark ? '#333' : '#e6e6e6' }]}>
            <Text style={[styles.messageText, { color: isDark ? '#fff' : '#000' }]}>{item}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={tabBarHeight + 10}
      >
        <View style={[styles.inputWrap, { backgroundColor: isDark ? '#111' : '#fff', marginBottom: tabBarHeight }]}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#222' : '#f2f2f2',
                color: isDark ? '#fff' : '#000',
              },
            ]}
            placeholder="Ask something..."
            placeholderTextColor={isDark ? '#aaa' : '#555'}
          />
          <TouchableOpacity onPress={send} style={styles.sendBtn}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerText: { fontSize: 18, fontWeight: 'bold' },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 14,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
  },
  sendBtn: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
});
