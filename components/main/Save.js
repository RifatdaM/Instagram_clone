import React, { useState } from "react";
import { StyleSheet, TextInput, View, Button, Image } from "react-native";

import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

export default function Save(props) {
  console.log(props.route.params.image)
  const [caption, setCaption] = useState("");

//   Image Upload
  const uploadImage = async () => {
    const uri = props.route.params.image;

    const childPath =`post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
    console.log(childPath);

    const respons = await fetch(uri);
    const blob = await respons.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = snapshot => {
      console.log(`transferred: ${snapshot.bytesTransferred}`)
    };

    const taksCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        console.log(snapshot)
      })
    };

    const taskError = snapshot => {
      console.log(snapshot);
    };
    task.on("state_changed", taskProgress, taskError, taksCompleted);
  }

  const savePostData = (downloadURL) => {

    firebase.firestore()
        .collection('posts')
        .doc(firebase.auth().currentUser.uid)
        .collection("userPosts")
        .add({
            downloadURL,
            caption,
            likesCount: 0,
            creation: firebase.firestore.FieldValue.serverTimestamp()
        }).then((function () {
            props.navigation.popToTop()
        }))
}
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
