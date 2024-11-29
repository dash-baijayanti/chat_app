import React from 'react';
import { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { collection, getDocs, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";

const Chat = ({ route, db, navigation }) => {
  const { userName = 'Guest', backgroundColor = '#FFFFFF',userID } = route.params || {};
  // const {backgroundColor} = route.params;
  const [messages, setMessages] = useState([]);

  console.log(messages);

  useEffect(() => {
    navigation.setOptions({ title: userName });
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc")
    );
    const unsubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach(doc => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis())
        })
      })
      setMessages(newMessages);
    })
    return () => {
      if (unsubMessages) unsubMessages();
    }
   }, []);

   const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
   }
 

  const renderBubble = (props) => {
    return ( 
      <Bubble 
        {...props} 
        textStyle={{ 
              right: { color: 'white' }, 
              left:{ color: 'black'}
        }} 
        wrapperStyle={{
            right: { backgroundColor: 'black', }, 
            left: { backgroundColor: 'white', }, 
        }} 
      />
    )}

  return (
    <View style={[styles.container, { backgroundColor }]}>
     <GiftedChat
      messages={messages}
      renderBubble={renderBubble}
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
      {Platform.OS === 'android' ? 
      <KeyboardAvoidingView behavior='height' /> : null 
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;