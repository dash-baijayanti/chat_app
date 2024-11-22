import React from 'react';
import { useState } from 'react';
import {ImageBackground, StyleSheet, Text, TextInput, Button, View, TouchableOpacity} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const image = require('../image/BG3.jpg');

const Start = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

  const colors = [
    '#FFEB80', // Minion Yellow
    '#80AFFF', // Minion Blue
    '#80E680', // Lime Green
    '#FFA3D0', // Hot Pink
  ]
 return( 
 
  <SafeAreaProvider>
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.title}>ChitChat  Gossip</Text>
      <View style={styles.middle}>
        
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#888"
        value={userName}
        onChangeText={(text) => setUserName(text)}
      />
      <Text style={styles.colorTitle}>Choose Background Color</Text>
      <View style={styles.colorPicker}>
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.colorCircle, { backgroundColor: color }]}
            onPress={() => {
              setBackgroundColor(color); // Update the selected color
              navigation.navigate('Chat', { userName, backgroundColor: color }); // Pass both params to Chat
            }}
         />
        ))}
      </View>

      <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Chat', { userName, backgroundColor })} // Pass the selected color
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
       </TouchableOpacity>
       </View>
      </ImageBackground>
    </SafeAreaView>
  </SafeAreaProvider>
  
)};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  button:{
    height: 50,
    margin: 20,
    borderWidth: 1,
    padding: 10,
    backgroundColor:'#333',
  },
  input: {
    height: 50,
    margin: 20,
    borderWidth: 1,
    padding: 10,

  },
  colorTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    justifyContent: 'center',
  },
  text: {
    color: 'black',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
    marginBottom: 10,
  },
  middle: {
    flex: 0.3,
    backgroundColor: 'beige',
    borderWidth: 1,
    justifyContent: 'space-between',
    padding: 10,
    margin: 10,
    borderRadius:10,
  },
  title: {
    fontSize: 36, 
    color: '#005BBB', 
    fontWeight: 'bold', 
    fontFamily: 'Baloo Bhai', 
    textAlign: 'center',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  colorCircle: {
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    margin: 10, 
    borderWidth: 2,
    borderColor: '#ccc',
  },
});

export default Start;