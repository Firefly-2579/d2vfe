import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import API_BASE_URL from "../config";

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const validatePasswordStrength = (password) => {
    const regex =/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handleResetPassword = async () => {
    setMessage('');

    if (!newPassword || !confirmPassword) {
      setMessage('Please fill out all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    if (!validatePasswordStrength(newPassword)) {
      setMessage('Password must be at least 8 characters long and include atleast one uppercase, lowercase,special character and a number.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, {
        email,
        newPassword
      });

      if (response.data.status === 'success') {
  setMessage('Password has been reset successfully.');
  
  setTimeout(() => {
    setLoading(false);
    navigation.navigate('SigninScreen');
  }, 2000);
  return; 
} else {
        setMessage(response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Unable to connect to the server.');
    } finally {
  if (response?.data?.status !== 'success') {
    setLoading(false);
  }
}
};
  return (
    <LinearGradient colors={["#E6E6FA", "#D8BFD8"]} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter a new password for {email}</Text>

<View style={{ width: '100%' }}>
  <TextInput
    style={styles.input}
    placeholder="New Password"
    placeholderTextColor="#666"
    secureTextEntry={!newPasswordVisible}
    value={newPassword}
    onChangeText={setNewPassword}
  />
  <TouchableOpacity onPress={() => setNewPasswordVisible(!newPasswordVisible)} style={styles.eyeButton}>
    <Image
      source={
        newPasswordVisible
          ? require('../assets/icons8-eye-30.png')
          : require('../assets/icons8-hide-30.png')
      }
      style={styles.eyeIcon}
    />
  </TouchableOpacity>
</View>

<View style={{ width: '100%' }}>
  <TextInput
    style={styles.input}
    placeholder="Confirm Password"
    placeholderTextColor="#666"
    secureTextEntry={!confirmPasswordVisible}
    value={confirmPassword}
    onChangeText={setConfirmPassword}
  />
  <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={styles.eyeButton}>
    <Image
      source={
        confirmPasswordVisible
          ? require('../assets/icons8-eye-30.png')
          : require('../assets/icons8-hide-30.png')
      }
      style={styles.eyeIcon}
    />
  </TouchableOpacity>
</View>


        {message ? <Text style={styles.message}>{message}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Reset Password</Text>}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { width: "85%", padding: 20, backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: 15, alignItems: "center", marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#4B0082", marginBottom: 20 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20, textAlign: "center" },
  input: { width: "100%", height: 45, paddingLeft: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 15, backgroundColor: "#fff", color: "#333" },
  button: { backgroundColor: "#6A0DAD", padding: 15, borderRadius: 10, alignItems: "center", width: "100%", marginTop: 20 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  message: { color: "red", marginTop: 10, textAlign: "center" },
  eyeButton: { position: 'absolute', right: 10, top: 10 },
  eyeIcon: { width: 20, height: 20 },
});

export default ResetPasswordScreen;
