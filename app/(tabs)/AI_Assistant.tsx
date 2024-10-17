import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';

// Custom agent icons using Emojis
const agentIcons = {
  'emergency services': '🚨',
  'legal services': '⚖️',
  'mental health services': '🧠',
  'self-defense services': '🥋',
  'general services': '🔧',
};

export default function AI_AssistantScreen() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string; agent?: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    setIsLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', content: message }]);
    setMessage('');

    try {
      const response = await fetch('http://192.168.56.1:8080/safe_srilanka/ai_assistant/chat', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.response, agent: data.agent }]);
    } catch (error) {
      console.error('Error:', error);
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer}>
        {chatHistory.map((chat, index) => (
          <View key={index} style={chat.role === 'user' ? styles.userMessage : styles.assistantMessage}>
            {chat.agent && (
              <Text style={styles.agentText}>
                {agentIcons[chat.agent.toLowerCase() as keyof typeof agentIcons] || '💬'} {chat.agent}
              </Text>
            )}
            <Text style={styles.messageText}>{chat.content}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message here..."
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#007AFF', // Make assistant message same blue as user message
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  messageText: {
    color: '#ffffff',
    fontSize: 16,
  },
  agentText: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
