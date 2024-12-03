import { StyleSheet, Alert } from 'react-native';
import Start from './components/Start';
import Chat from './components/Chat';
// import ShoppingLists from './components/ShoppingLists';
// import Welcome from './components/Welcome';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initializeApp } from "firebase/app";
import { getFirestore,  disableNetwork, enableNetwork  } from "firebase/firestore";
import { useNetInfo }from '@react-native-community/netinfo';
import { useEffect } from 'react';


const App = () => {

  const connectionStatus = useNetInfo();  

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  // Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGOXyJr0e2OeXgfDN9H9F12D28D_DmEDc",
  authDomain: "chatapp-8fe01.firebaseapp.com",
  projectId: "chatapp-8fe01",
  storageBucket: "chatapp-8fe01.firebasestorage.app",
  messagingSenderId: "1045181988191",
  appId: "1:1045181988191:web:7f826feb2dae95dffe8aea"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const Stack = createNativeStackNavigator();

  return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
        >
          <Stack.Screen
            name="Start"
            component={Start}
            
          /> 

          <Stack.Screen
            name="Chat"
            // component={Chat}
            options={({ route }) => ({ title: route.params?.userName || "Chat" })}
          >
               {props => <Chat isConnected={connectionStatus.isConnected} db={db} {...props} />}
            </Stack.Screen> 
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;
