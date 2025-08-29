import React, { useEffect,useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import Screens
import SplashScreen from "./screens/SplashScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import VerifyCodeScreen from "./screens/VerifyCodeScreen";
import HomeScreen from "./screens/HomeScreen"; 
import VoiceCloningScreen from "./screens/VoiceCloningScreen";
import VoiceCloning2Screen from "./screens/VoiceCloning2Screen";
import VCRecordingScreen from "./screens/VCRecordingScreen";
import TextInputScreen from "./screens/TextInputScreen";
import VCOutputScreen from "./screens/VCOutputScreen";

import UploadDocumentScreen from "./screens/UploadDocumentScreen";
import UD2Screen from "./screens/UD2Screen";

import FileScreen from "./screens/FileScreen";
import AccountScreen from "./screens/AccountScreen";

import FAQScreen from "./screens/FAQScreen";
import AboutScreen from "./screens/AboutScreen";

// Navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Voice Cloning Stack Navigator

function VoiceCloningStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VoiceCloningScreen" component={VoiceCloningScreen} />
      <Stack.Screen name="VoiceCloning2Screen" component={VoiceCloning2Screen} />
      <Stack.Screen name="VCRecordingScreen" component={VCRecordingScreen} />
      <Stack.Screen name="TextInputScreen" component={TextInputScreen} />
      <Stack.Screen name="VCOutputScreen" component={VCOutputScreen} />
    </Stack.Navigator>
  );
}

function AccountScreenStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen name="FAQScreen" component={FAQScreen} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
    </Stack.Navigator>
  );
}

function UploadDocumentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UploadDocumentScreen" component={UploadDocumentScreen} />
      <Stack.Screen name="UD2Screen" component={UD2Screen} />
    </Stack.Navigator>
  );
}

function SigninNav(){
  
return(
  <Stack.Navigator initialRouteName="SplashScreen">
  <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
  <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
  <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
  <Stack.Screen name="SigninScreen" component={SigninScreen} options={{ headerShown: false }} />
  <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: false }} />
  <Stack.Screen name="VerifyCodeScreen" component={VerifyCodeScreen} options={{ headerShown: false }} />
  <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{ headerShown: false }} />
  <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
  <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
</Stack.Navigator>
);
}

// Bottom Tab Navigator
function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: "#EAD1DC" },
        tabBarActiveTintColor: "#4B0082",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Voice Cloning") iconName = "mic-outline";
          else if (route.name === "Upload Document") iconName = "cloud-upload-outline";
          else if (route.name === "My Files") iconName = "folder-outline";
          else if (route.name === "My Account") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Voice Cloning" component={VoiceCloningStack} />
      <Tab.Screen name="Upload Document" component={UploadDocumentStack} />
      <Tab.Screen name="My Files" component={FileScreen} />
      <Tab.Screen name="My Account" component={AccountScreenStack} />
    </Tab.Navigator>
  );
}

function RootNavigator(){

  const [isSignedIn,setIsSignedIn]= useState(false);
  async function getData(){
    const data = await  AsyncStorage.getItem('isSignedIn');
    console.log(data,'at app.js');
    setIsSignedIn(data);
  }

  useEffect(()=>{
    getData();
  }, []);
  
  return(
<Stack.Navigator screenOptions={{headerShown: false}}>
{isSignedIn ? ( <Stack.Screen name="Main" component={BottomTabNavigator}/> ):( <Stack.Screen name="Auth" component={SigninNav}/> )}
  
  </Stack.Navigator>
  );
}


// Main App Navigator
export default function App() {
  
  

  return (
    <NavigationContainer >
        <RootNavigator/>
    </NavigationContainer>
  );
}




