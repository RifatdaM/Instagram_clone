import React, { useState } from "react";
import { StyleSheet, TextInput, View, Button, Image } from "react-native";

import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

export default function Save(props) {
  const [caption, setCaption] = useState("");

//   Image Upload
  const uploadImage = async () => {
    const uri = props.route.params.image;

    const childPath =
      `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
    console.log(childPath);

    const respons = await fatch(uri);
    const blob = await respons.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = snapshot => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taksCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        console.log(snapshot);
      });
    };

    const taskError = snapshot => {
      console.log(snapshot);
    };
    task.on("state_changed", taskProgress, taskError, taksCompleted);
  };



  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: props.route.params.image }} />
      <TextInput
        placeholder="Write Whats on your mind....."
        onChangeText={(caption) => setCaption(caption)}
      />
      <Button title="Upload" onPress={() => uploadImage()} />
    </View>
  );
}
