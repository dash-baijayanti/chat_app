import { View, StyleSheet, FlatList, Text, Platform, TextInput, KeyboardAvoidingView, Alert, TouchableOpacity, LogBox} from "react-native";
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, onSnapshot, query, where } from "firebase/firestore";

const ShoppingLists = ({db, route}) => {
  const {userID} = route.params;
const [lists, setLists] = useState(" ");
const [item1, setItem1] = useState(" ");
const [item2, setItem2] = useState(" ");
const [listName, setListName] = useState(" ");

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const addShoppingList = async (newList) => {
  // Validate inputs before adding the list
  if (!newList.name.trim()) {
    Alert.alert("Invalid Input", "List name cannot be empty.");
    return;
  }

  if (!Array.isArray(newList.items) || newList.items.some(item => !item.trim())) {
    Alert.alert("Invalid Input", "All items must have a valid name.");
    return;
  }

  try {
    const newListRef = await addDoc(collection(db, "shoppingList"), newList);
    if (newListRef && newListRef.id) {
      setLists([newList, ...lists]);
      Alert.alert(`The list "${newList.name}" has been added.`);
    } else {
      Alert.alert("Unable to add. Please try later.");
    }
  } catch (error) {
    console.error("Error adding document: ", error);
    Alert.alert("Unable to add. Please try later.");
  }
};

// const fetchShoppingLists = async () => {
//   const listsDocuments = await getDocs(collection(db, "shoppingList"));
//   let newLists = [];
//   listsDocuments.forEach(docObject => {
//     newLists.push({ id: docObject.id, ...docObject.data() })
//   });
//   setLists(newLists)
// }

useEffect(() => {
  const q = query(collection(db, "shoppinglists"),where("uid", "===",  userID));
  const unsubShoppinglists = onSnapshot(q, (documentsSnapshot) => {
    let newLists = [];
    documentsSnapshot.forEach(doc => {
      newLists.push({ id: doc.id, ...doc.data() })
    });
    setLists(newLists);
  });
  return () => {
    if (unsubShoppinglists) unsubShoppinglists();
  }
}, []);

  return(
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
    <View style={styles.container}>
      <FlatList
        style={styles.listsContainer}
        data={lists}
        renderItem={({ item }) =>
          <View style={styles.listItem}>
             <Text>
            {item.name}: {Array.isArray(item.items) ? item.items.join(", ") : "No items"}
          </Text>
          </View>
        }
      />
      <View style={styles.listForm}>
        <TextInput
          style={styles.listNames}
          placeholder="List Name"
          placeholderTextColor="#888" 
          value={listName}
          onChangeText={setListName}
        />
        <TextInput
          style={styles.item}
          placeholder="Item #1"
          placeholderTextColor="#888"
          value={item1}
          onChangeText={setItem1}
        />
        <TextInput
          style={styles.item}
          placeholder="Item #2"
          placeholderTextColor="#888"
          value={item2}
          onChangeText={setItem2}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => { 
            const newList = {
              uid: userID,
              name: listName,
              items: [item1, item2]
            }
            addShoppingList(newList);
          }}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      
    </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listItem: {
    height: 70,
    justifyContent: "center",
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#AAA",
    flex: 1,
    flexGrow: 1
  },
  listForm: {
    flexBasis: 275,
    flex: 0,
    margin: 15,
    padding: 15,
    backgroundColor: "#CCC"
  },
  listNames: {
    height: 50,
    padding: 15,
    fontWeight: "600",
    marginRight: 50,
    marginBottom: 15,
    borderColor: "#555",
    borderWidth: 2
  },
  item: {
    height: 50,
    padding: 15,
    marginLeft: 50,
    marginBottom: 15,
    borderColor: "#555",
    borderWidth: 2
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: "#000",
    color: "#FFF"
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 20
  }
});

export default ShoppingLists;