import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, navigation } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const Chat = ({ route, db, navigation, isConnected, storage }) => {
  const { userName = 'Guest', backgroundColor = '#FFFFFF', userID } = route.params || {};
  const [messages, setMessages] = useState([]);


  let unsubMessages;
  useEffect(() => {
    navigation.setOptions({ title: userName });
    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

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
        cacheMessages(newMessages);
        setMessages(newMessages);

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

  const onSend = (newMessages) => {
    try {
      addDoc(collection(db, "messages"), newMessages[0]);
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

  const renderCustomActions = (props) => {
    return <CustomActions onSend={onSend} userID={userID} storage={storage} {...props} />;
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }


  return (
    <View style={[styles.container, { backgroundColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar} // Attach the custom InputToolbar
        onSend={messages => onSend(messages)}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        user={{
          _id: userID,
          name: userName,
        }}
      // renderAvatarOnTop={true}
      // showUserAvatar={true}
      // textInputProps={{
      //   placeholderTextColor: 'gray',
      // }}
      // style={{ backgroundColor: backgroundColor }}
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