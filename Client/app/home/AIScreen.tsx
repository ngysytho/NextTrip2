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

export default function AIScreen() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const tabBarHeight = useBottomTabBarHeight();

  const send = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [...prev, inputText]);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>TripChat</Text>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>{item}</Text>
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
        <View style={[styles.inputWrap, { marginBottom: tabBarHeight }]}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            style={styles.input}
            placeholder="Ask something..."
            placeholderTextColor="#555"
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  messageBubble: {
    backgroundColor: '#e6e6e6',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  messageText: {
    color: '#000',
    fontSize: 14,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#000',
    fontSize: 14,
  },
  sendBtn: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
});
