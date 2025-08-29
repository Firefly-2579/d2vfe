import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import API_BASE_URL from "../config";

const VerifyCodeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleVerifyOtp = async () => {
    setMessage("");

    const trimmedOtp = otp.trim();

    if (!trimmedOtp) {
      setMessage("Please enter the OTP.");
      return;
    }

    if (!/^\d{6}$/.test(trimmedOtp)) {
      setMessage("OTP must be a 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
        email,
        otp: trimmedOtp,
      });

      if (response.data.status === "success") {
        setTimeout(()=> {
        navigation.navigate("ResetPasswordScreen", { email });
        },2000);
      } else {
        setMessage("Invalid code. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage(error.response?.data?.message || "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#E6E6FA", "#D8BFD8"]} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Verify Code</Text>
        <Text style={styles.subtitle}>Enter the OTP sent to {email}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Code"
          placeholderTextColor="#666"
          keyboardType="numeric"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
        />

        {message ? <Text style={styles.errorMessage}>{message}</Text> : null}
        {loading ? (
            <ActivityIndicator size="large" color="#6A0DAD" style={{ marginVertical: 10 }} />
        ):( <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      )} 
         </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    width: "85%",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#4B0082", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20, textAlign: "center" },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    color: "#333",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#6A0DAD",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  errorMessage: { color: "red", marginTop: 10, textAlign: "center" },
});

export default VerifyCodeScreen;