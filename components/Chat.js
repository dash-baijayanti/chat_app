import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const Chat = ({ route }) => {
  const { userName = 'Guest', backgroundColor = '#FFFFFF' } = route.params || {};

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <SafeAreaView >
        <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
      </SafeAreaView>
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