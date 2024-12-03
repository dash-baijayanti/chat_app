import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, db, isConnected }) => {
  const { userName = 'Guest', backgroundColor = '#FFFFFF', userID } = route.params || {};
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let unsubMessages;
    if (isConnected) {
      // Fetch messages from Firestore
      const q = query(
        collection(db, "messages"),
        orderBy("createdAt", "desc")
      );

      unsubMessages = onSnapshot(q, (querySnapshot) => {
        const newMessages = querySnapshot.docs.map(doc => ({
          _id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toMillis ? new Date(doc.data().createdAt.toMillis()) : new Date()
        }));

        // Update messages and cache them
        setMessages(newMessages);
        cacheMessages(newMessages);
      });
    } else {
      // Load cached messages
      loadCachedMessages();
    }

    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

  // Cache messages in AsyncStorage
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('cached_messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.error("Error caching messages:", error);
    }
  };

  // Load cached messages from AsyncStorage
  const loadCachedMessages = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem('cached_messages');
      if (cachedMessages) {
        setMessages(JSON.parse(cachedMessages));
      }
    } catch (error) {
      console.error("Error loading cached messages:", error);
    }
  };

  const onSend = async (newMessages) => {
    try {
      await addDoc(collection(db, "messages"), {
        ...newMessages[0],
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderBubble = (props) => (
    <Bubble
      {...props}
      textStyle={{
        right: { color: 'white' },
        left: { color: 'black' }
      }}
      wrapperStyle={{
        right: { backgroundColor: 'black' },
        left: { backgroundColor: 'white' }
      }}
    />
  );

  // Customize InputToolbar rendering
  const renderInputToolbar = (props) => {
    if (isConnected) {
      return <InputToolbar {...props} />;
    } else {
      return null; // Do not render InputToolbar when offline
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar} // Attach the custom InputToolbar
        onSend={messages => onSend(messages)}
        user={{
          _id: userID,
          name: userName,
        }}
        renderAvatarOnTop={true}
        showUserAvatar={true}
        textInputProps={{
          placeholderTextColor: 'gray',
        }}
        style={{ backgroundColor: backgroundColor }}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;