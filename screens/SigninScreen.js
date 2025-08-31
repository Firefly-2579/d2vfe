import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ActivityIndicator,TouchableOpacity, Image, } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from "../config";

const SigninScreen = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [loading, setLoading] = useState(false);

  function handlesignin() {
    console.log(identifier, password);
    
    const userData = {
      identifier: identifier,
      password: password
    };
  
    if (identifier && password) {
      setLoading(true);
      axios
        .post(`${API_BASE_URL}/signin-user`, userData)
        .then(res => {
          console.log(res.data);
          if (res.data.status === "ok") {
            Alert.alert("Sign-in Successful!");
            AsyncStorage.setItem("token", res.data.data);
            AsyncStorage.setItem("isSignedIn", JSON.stringify(true));
            setLoading(false);
            navigation.navigate("HomeScreen");
          } else {
            setLoading(false);
            Alert.alert(  res.data.message );
          }
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
          Alert.alert("Error", "An error occurred during sign-in. Please try again.");
        });
    } else {
      Alert.alert("Fill mandatory fields");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Sign In To Account</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email/Username"
          value={identifier}
          onChangeText={setIdentifier}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!passwordVisible} 
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)} 
          >
            <Image
              source={
                passwordVisible
                  ? require('../assets/icons8-eye-30.png') // Eye-open icon
                  : require('../assets/icons8-hide-30.png') // Eye-closed icon
              }
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')} >
          <Text style={styles.forgotPassword}>Forgot Password</Text>
          
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
         style={styles.continueButton}
         onPress={() => handlesignin()} 
         disabled={loading}
       >
        {loading ? ( <ActivityIndicator color="#6A0DAD"/>):( <Text style={styles.buttonText}>Continue</Text> )}        
      </TouchableOpacity>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
        <Text style={styles.signupText}>
          Are you a new user? <Text style={styles.signupLink}>Signup</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    backgroundColor: '#D7B8F8',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 50,
  },

  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6A0DAD',
  },

  inputContainer: {
    width: '100%',
    marginBottom: 35,
  },

  input: {
    borderWidth: 1,
    borderColor: '#6A0DAD',
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
    backgroundColor: '#F8F8F8',
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#6A0DAD',
    borderRadius: 10,
    paddingRight: 10,
    paddingLeft: -10,
    backgroundColor: '#F8F8F8',
  },

  passwordInput: {
    flex: 1,
    padding: 15,
  },

  eyeIcon: {
    width: 20,
    height: 20,
   
  },
  forgotPassword: {
    textAlign: 'right',
    marginTop: 20,
    color: '#6A0DAD',
    textDecorationLine: 'underline',
  },
  continueButton: {
    backgroundColor: '#D7B8F8',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 80,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#6A0DAD',
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  orText: {
    marginHorizontal: 10,
    color: '#6A0DAD',
    fontWeight: 'bold',
  },
  
  signupText: {
    color: '#333',
    fontSize: 14,
  },
  signupLink: {
    color: '#6A0DAD',
    fontWeight: 'bold',
  },
});

export default SigninScreen;