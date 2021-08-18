import firebase from "firebase";
import {
  USER_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
} from "../constants/index";
import { SnapshotViewIOSComponent } from "react-native";
require("firebase/firestore");

export function fetchUser() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
        } else {
          console.log("dose not exist");
        }
      });
  };
}

export function fetchUserPosts() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .orderBy("creation", "desc")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
      });
  };
}

export function fetchUserFollowing() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map((doc) => {
          const id = doc.id;
          return id;
        });
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
        for (let i = 0; i < following.length; i++) {
          dispatch(fetchUsersData(following[i], true));
        }
      });
  };
}

export function fetchUsersData(uid) {
  return (dispatch, getState) => {
    const found = getState().usersState.users.some((el) => el.uid === uid);

    if (!found) {
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            let user = snapshot.data();
            user.uid = snapshot.id;
            dispatch({ type: USERS_DATA_STATE_CHANGE, user });
            dispatch(fetchUsersFollowingPosts(user.uid));
          } else {
            console.log("dose not exist");
          }
        });
    }
  };
}

export function fetchUsersFollowingPosts(uid) {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        // let uid = snapshot.docs[0].ref.path.split("/")[1];
        // console.log(typeof(uid))
        let loop_runner = true;
        let uid = "";
        
        for (var key in snapshot.query) {
          if (key === "segments") {
            uid = snapshot.query[key][1];
            console.log(typeof(uid))
            loop_runner = false;
          }
          if (!loop_runner) {
            break;
          }
          for (var key2 in snapshot.query[key]) {
            if (key2 === "segments") {
              uid = snapshot.query[key][key2][1];
              console.log(typeof(uid))
              loop_runner = false;
            }
            if (!loop_runner) {
              break;
            }
            for (var key3 in snapshot.query[key][key2]) {
              if (key3 === "segments") {
                uid = snapshot.query[key][key2][key3][1];
                console.log(typeof(uid))
                loop_runner = false;
              }
              if (!loop_runner) {
                break;
              }
              for (var key4 in snapshot.query[key][key2][key3]) {
                if (key4 === "segments") {
                  uid = snapshot.query[key][key2][key3][key4][1];
                  console.log(typeof(uid))
                  loop_runner = false;
                }
                if (!loop_runner) {
                  break;
                }
              }
              if (!loop_runner) {
                break;
              }
            }
            if (!loop_runner) {
              break;
            }
          }
          if (!loop_runner) {
            break;
          }
        }
        console.log({ snapshot, uid });
        const user = getState().usersState.users.find((el) => el.uid === uid);

        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data, user };
        });
        console.log(posts);
        dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid });
        console.log(getState());
      });
  };
}
