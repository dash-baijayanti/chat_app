import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
// import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
// import MapView from 'react-native-maps';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getStorage } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';


const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
  const actionSheet = useActionSheet();

  const onActionPress = () => {

    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    // const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            // console.log('user wants to pick an image');
            return;
          case 1:
            takePhoto();
            // console.log('user wants to take a photo');
            return;
          case 2:
            getLocation();
          // console.log('user wants to get their location');
          default:
        }
      },
    );
  };

  const generateReference = (uri) => {
    // this will get the file name from the uri
    const imageName = uri.split("/")[uri.split("/").length - 1];
    const timeStamp = (new Date()).getTime();
    return `${ userID }-${ timeStamp }-${ imageName }`;
  }

  const uploadAndSendImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI);
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(imageURI);
    const blob = await response.blob();
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const imageURL = await getDownloadURL(snapshot.ref)
      onSend({ image: imageURL })
    });
  }

  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        const imageURI = result.assets[0].uri;
        const response = await fetch(imageURI);
        const blob = await response.blob();
        const newUploadRef = ref(storage, 'image123');
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
          console.log('File has been uploaded successfully');
        })
      }
      else Alert.alert("Permissions haven't been granted.");
    }
  }

  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  }

  // const handleLocation = (latitude, longitude) => {
  //   const locationMessage = {
  //     _id: Math.random().toString(),
  //     createdAt: new Date(),
  //     user: { _id: userID, name: userName },
  //     location: { latitude, longitude },  // Ensure location data is correctly assigned here
  //   };
  //   onSend([locationMessage]);
  // };

  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        const locationMessage = {
          _id: uuidv4(), // Generate unique ID
          createdAt: new Date(),
          user: {
            _id: userID,
          },
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        };
        onSend([locationMessage]); // Send as an array
      } else {
        Alert.alert("Error occurred while fetching location");
      }
    } else {
      Alert.alert("Permissions haven't been granted.");
    }
  };

  return (
    <TouchableOpacity style={styles.container}
      onPress={onActionPress}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>
          +
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 10,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;