import React, { useState, useEffect } from 'react';
import { View,  Text,  TextInput, TouchableOpacity, Image,  StyleSheet, BackHandler, ActivityIndicator, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Error from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import API_BASE_URL from "../config";


const SignupScreen = () => {
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [username, setUsername] = useState('');
  const [usernameVerify,setUsernameVerify]=useState(false);

  const [email, setEmail] = useState('');
  const [emailVerify,setEmailVerify] = useState(false)

  const [password, setPassword] = useState('');
  const [passwordVerify,setPasswordVerify] = useState(false)

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const [showOtpInput, setShowOtpInput] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  

  const togglePasswordVisibility = () => {
    setPasswordVisible(prevState => !prevState);
  };

  

  function handleName(nameVar) {
    setUsername(nameVar);
    setUsernameVerify(false)
    if (nameVar.length > 1) {
      setUsernameVerify(true);
    } else {
      setUsernameVerify(false);
    }
  }

  function handleEmail(emailVar){
setEmail(emailVar);
setEmailVerify(false);
if(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar)){
  setEmail(emailVar)
  setEmailVerify(true)
}
  }
  function handlePassword(passwordVar){
    setPassword(passwordVar);
    setPasswordVerify(false);
    if( /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(passwordVar)){
      setPassword(passwordVar);
      setPasswordVerify(true);
    }
    }

    const handleSignup = async () => {
      const userData = { username, email, password };
    
      if (!usernameVerify || !emailVerify || !passwordVerify) {
        return Alert.alert("Fill mandatory details");
      }
    
      if (!otpSent) {
        console.log("Email entered", email);
        try {
          const response = await axios.post(`${API_BASE_URL}/send-otp`, {email});
          console.log("respone:", response.data);
          if (response.data.status === "success") {
            setOtpSent(true);
            setShowOtpInput(true);
            if (response.data.success) {
              setShowOtpInput(true); // you control OTP input visibility with this state
            }
            Alert.alert("OTP sent to your email.");
          } else {
            Alert.alert("Failed to send OTP. Try again.");
          }
        } catch (error) {
          console.error(error);
          console.log("error", error.response?.data || error.message);
          Alert.alert("User aleady exists with this email!");
        }
      } else if (!emailVerified) {
        try {
          const response = await axios.post(`${API_BASE_URL}/verify-for-email`, { email, otp });
          if (response.data.status === "success") {
            setEmailVerified(true);
            createAccount(); // Call actual signup
          } else {
            Alert.alert("Invalid OTP. Please try again.");
          }
        } catch (error) {
          console.error(error);
          Alert.alert("Error verifying OTP.");
        }
      }
    };
    
    const createAccount = async () => {
      try {
        setLoading(true);
        const userData = { username, email, password };
        const res = await axios.post(`${API_BASE_URL}/signup`, userData);
        setLoading(false);
    
        if (res.data.status === "ok") {
          Alert.alert("Registration Successful!");
          navigation.navigate("SigninScreen");
        } else {
          Alert.alert("Signup failed.");
        }
      } catch (e) {
        setLoading(false);
        console.log(e);
        Alert.alert("Something went wrong.");
      }
    };



  useEffect(() => {
    const backAction = () => {
      navigation.navigate('WelcomeScreen');
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);

  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Sign Up To Account</Text>
      </View>

   <View style={styles.inputContainer}>
       
    <View style={styles.inputWithIcon}>
     <TextInput
       style={styles.inputInner}
       placeholder="Username"
       placeholderTextColor="#6A0DAD"
       value={username}
       onChangeText={handleName}  
      />
     {username.length < 1 ? null : usernameVerify ? (
       <Feather name="check-circle" color="green" size={20} style={styles.iconRight} />
        ) : (
       <Error name="error" color="red" size={20} style={styles.iconRight} />
        )}
    </View>

     {username.length < 1 ? null : !usernameVerify && (
      <Text style={styles.errorText}>Name should be more than one characters.</Text>
     )}

    <View style={styles.inputWithIcon}>  
    <TextInput
          style={styles.inputInner}
          placeholder="Email Address"
          placeholderTextColor="#6A0DAD"
          keyboardType="email-address"
          value={email}
          onChangeText={handleEmail}
        />
        {email.length < 1 ? null:   emailVerify? (
          <Feather name="check-circle" color="green" size={20} style={styles.iconRight} /> 
          ) : (
          <Error name="error" color="red" size={20} style={styles.iconRight} />
          )}
      </View>   
        
        {email.length < 1 ? null : !emailVerify && (
          <Text style={styles.errorText}>Email Address should be proper.</Text>)}
       
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#6A0DAD"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={handlePassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Image
              source={
                passwordVisible
                  ? require('../assets/icons8-eye-30.png')
                  : require('../assets/icons8-hide-30.png')
              }
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
          </View>
          {password.length < 1 ? null : passwordVerify ? null : (<Text style= {styles.errorText}>Must be atleast 8 characters.Uppercase, Lowercase and numbers must be included. </Text>)}
        
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      {showOtpInput && !emailVerified && (
  <View style={styles.inputWithIcon1}>
    <TextInput
      style={styles.inputInner1}
      placeholder="Enter OTP"
      placeholderTextColor="#6A0DAD"
      keyboardType="numeric"
      value={otp}
      onChangeText={setOtp}
    />
  </View>
)}

      <TouchableOpacity style={styles.continueButton} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#6A0DAD" /> : <Text style={styles.buttonText}>Continue</Text>}
      </TouchableOpacity>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('SigninScreen')}>
        <Text style={styles.signupText}>
          Already a Member? <Text style={styles.signupLink}>SignIn</Text>
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
     justifyContent: 'center', 
     padding: 20 
  },
  header: { 
    width: '100%', 
    backgroundColor: '#D7B8F8', 
    padding: 20, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 20 
  },
  headerText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#6A0DAD' 
  },
  inputContainer: { 
    position: 'relative',
    width: '100%', 
    marginBottom: 40, 
  },
 
  passwordContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#6A0DAD', 
    borderRadius: 10, 
    paddingHorizontal: 10, 
    backgroundColor: '#F8F8F8', 
    marginTop: 20,
  },
  
  passwordInput: { 
    flex: 1, 
    paddingVertical: 10 
  },
  eyeIcon: { 
    width: 20, 
    height: 20 
  },
  continueButton: { 
    backgroundColor: '#D7B8F8', 
    borderRadius: 10, 
    paddingVertical: 15, 
    paddingHorizontal: 80, 
    alignItems: 'center', 
    marginBottom: 10 ,
    marginTop: 10,
  },
  buttonText: { 
    color: '#6A0DAD', 
    fontWeight: 'bold' 
  },
  orContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 25 
  },
  line: { 
    flex: 1, 
    height: 1, 
    backgroundColor: '#CCCCCC' 
  },
  orText: { 
    marginHorizontal: 10, 
    color: '#6A0DAD', 
    fontWeight: 'bold' 
  },
  signupText: { 
    color: '#333', 
    fontSize: 14 
  },
  signupLink: { 
    color: '#6A0DAD', 
    fontWeight: 'bold' 
  },
  message: { 
    color: 'green', 
    marginTop: 10, 
    textAlign: 'center', 
    fontWeight: 'bold' 
  },

  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6A0DAD',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F8F8F8',
    marginTop: 20,
    
  },
  
  inputInner: {
    flex: 1,
    paddingVertical: 15,
    color: '#000',
    
  },

  
  inputInner1: {
    flex: 1,
    paddingVertical: 15,
    color: '#000',
    
  },
  inputWithIcon1: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6A0DAD',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F8F8F8',
    marginTop: -20,
    
  },
  
  iconRight: {
    marginLeft: 10,
  },
  
  errorText: {
    marginLeft: 5,
    color: 'red',
    marginBottom:10,
    marginTop:5,
  },
});

export default SignupScreen;
