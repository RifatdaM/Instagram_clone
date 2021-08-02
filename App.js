import { StatusBar } from 'expo-status-bar';
import React, { Component }  from 'react';

import { View, Text } from 'react-native';

// Import Firebase
import firebase from 'firebase/app'

// Import Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk';
const store =createStore(rootReducer, applyMiddleware(thunk))

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqO3hGZDN-JqOpV0Gx_WMWh4f1jqloEXs",
  authDomain: "instagram-clone-9cdd4.firebaseapp.com",
  projectId: "instagram-clone-9cdd4",
  storageBucket: "instagram-clone-9cdd4.appspot.com",
  messagingSenderId: "643370468159",
  appId: "1:643370468159:web:f83e13daafd23efd16898a",
  measurementId: "G-5Q9CTG80LB"
};
// Checking Firebase
if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig);
}

// React Library Import
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


// Import Different Pages
import LandingScreen from './components/auth/landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/login'
import MainScreen from './components/Main'

// Route
const Stack = createStackNavigator();

export class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      }
      else{
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }
  render() {
    const {loggedIn, loaded} = this.state;

    if(!loaded){
      return(
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text>Loading...</Text>
        </View>
      )
    }

    if(!loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return(
      <Provider store = {store}>
        <MainScreen/>
      </Provider>
      
    )
    
  }
}

export default App
