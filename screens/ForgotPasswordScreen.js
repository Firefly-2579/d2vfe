import React, { useState, useEffect } from "react";
import { View, Text, Alert, TextInput, TouchableOpacity, StyleSheet, BackHandler, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import API_BASE_URL from "../config";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const validateEmail=(text) => {
  
  setEmail(text);
  if((/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(text)) ){
    setEmailError("");
  } else {
    setEmailError("Invalid Email Format");
  }
}; 

const handleForgotPassword = () => {
  if(emailError || !email){
    showAlert("Alert", "Please provide valid email address.");
return;
  }
  setLoading(true);
  axios
  .post(`${API_BASE_URL}/forgot-password`,{email})
  .then((res)=>{
    showAlert("Success", res.data.message || "Reset link sent to your email.");
    setTimeout(()=> {
    navigation.navigate("VerifyCodeScreen",{email});
    },1000);
  })
  .catch((error)=> { 
    showAlert("Error",error.response?.data.message || "Unable to process request.");
  })
  .finally(()=> {
    setLoading(false);
  });
};

const showAlert = (title,message) => {
  Alert.alert(title, message);
};

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("WelcomeScreen" )
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);

  return (
    <LinearGradient colors={["#E6E6FA", "#D8BFD8"]} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Enter your email to receive a reset code.</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={validateEmail}
        />
        
        {loading ? (
  <ActivityIndicator size="large" color="#6A0DAD" style={{ marginTop: 10 }} />
) : (
  <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
    <Text style={styles.buttonText}>Send Code</Text>
  </TouchableOpacity>
)}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { width: "85%", padding: 20, backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: 15, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", color: "#4B0082", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20, textAlign: "center" },
  input: { width: "100%", padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 15, backgroundColor: "#fff", color: "#333" },
  button: { backgroundColor: "#6A0DAD", padding: 15, borderRadius: 10, alignItems: "center", width: "100%" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  message: { color: "green", marginTop: 10, textAlign: "center" },
});

export default ForgotPasswordScreen;
