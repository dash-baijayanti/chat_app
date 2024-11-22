import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const Chat = ({ route }) => {
  const { userName, backgroundColor } = route.params;

  return (
    <View>
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
      {/* Your chat UI */}
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