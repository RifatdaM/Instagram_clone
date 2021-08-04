import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from 'expo-image-picker';

export default function Add({ navigation }) {
  // Camera Permission
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  // Gallery Permission
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  // Camera 
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      // Camera
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      // ImagePicker
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  // Function For taking Picture
  const takePicture = async () => {
    if(camera){
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  };

  // Function for picking Image form gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => {
            setCamera(ref);
          }}
          style={styles.camera}
          type={type}
          ratio={"1:1"}
        />
      </View>
      <Button
        style={styles.button}
        title="Flip Image"
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}
      >
        <Text style={styles.text}> Flip </Text>
      </Button>
      <Button title="Take Picture" onPress={() => takePicture()} />
      <Button title="Pick Image From Gallery" onPress={() => pickImage()} />

      <Button title="Save" onPress={() => navigation.navigate('Save',{image})} />
      {image && <Image source={{uri: image}} style={styles.image}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
  // buttonContainer: {
  //   flex: 1,
  //   backgroundColor: 'transparent',
  //   flexDirection: 'row',
  //   margin: 20,
  // },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  image:{
    flex:1
  },
});
