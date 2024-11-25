import React from 'react';
import { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';


const Chat = ({ route }) => {
  const { userName = 'Guest', backgroundColor = '#FFFFFF' } = route.params || {};
  // const {backgroundColor} = route.params;
  const [messages, setMessages] = useState([]);

  console.log(messages);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);
  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
     <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1
      }}
    />
      {Platform.OS === 'android' ? 
      <KeyboardAvoidingView behavior="height" /> : null 
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default Chat;