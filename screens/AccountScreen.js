import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from "../config";

const AccountScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const [confirmPassword, setConfirmPassword] = useState('');

  const [oldPassword, setOldPassword] = useState('');

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    axios
      .post(`${API_BASE_URL}/userdata`, { token })
      .then(res => {
        setUserData(res.data.data);
        setUsername(res.data.data.username);
        setEmail(res.data.data.email);
      })
      .catch(err => {
        Alert.alert('Error', 'Failed to fetch user data.');
      });
  }

  useEffect(() => { getData(); }, []);

  function signOut() {
    navigation.reset({ index: 0, routes: [{ name: 'WelcomeScreen' }] });
    AsyncStorage.setItem('isSignedIn', '');
    AsyncStorage.setItem('token', '');
  }


  const isValidPassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
  };


  const handlePasswordReset = async () => {
  if (!isValidPassword(newPassword)) {
    Alert.alert('Invalid Password', 'Must be 6 or more characters. Uppercase, Lowercase and numbers must be included.');
    return;
  }

  if (newPassword !== confirmPassword) {
    Alert.alert('Password Mismatch', 'New Password and Confirm Password do not match.');
    return;
  }

  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/resets-password`, {
      token,
      oldPassword,
      newPassword,
    });

    if (response.data.success) {
      Alert.alert('Success', 'Password has been updated.');
      setShowPasswordField(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      Alert.alert('Error', response.data.message || 'Password reset failed.');
    }
  } catch (error) {
    console.error('Password Reset Error:', error);
    // ✅ Show backend error message if available
    if (error.response && error.response.data && error.response.data.message) {
      Alert.alert('Error', error.response.data.message);
    } else {
      Alert.alert('Error', 'Something went wrong.');
    }
  }
};

  const handleSaveChanges = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const isUsernameChanged = username !== userData.username;

      if (!isUsernameChanged) {
        Alert.alert('No Changes', 'Username is unchanged.');
      } else {
        const response = await axios.post(`${API_BASE_URL}/update-profile`, { token, username });
        if (response.data.success) {
          Alert.alert('Success', 'Username updated.');
        } else {
          Alert.alert('Error', response.data.message || 'Failed to update username.');
          return;
        }
      }
      setIsEditing(false);
      setShowPasswordField(false);
      setNewPassword('');
      setPasswordVisible(false);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save changes.');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Delete',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await axios.post(`${API_BASE_URL}/delete-account`, { token });
  
              if (response.data.success) {
                await AsyncStorage.setItem('token', '');
                await AsyncStorage.setItem('isSignedIn', '');
                navigation.navigate("SigninScreen");
                Alert.alert('Account Deleted', 'Your account has been permanently removed.');
              } else {
                Alert.alert('Error', response.data.message || 'Failed to delete account.');
              }
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Something went wrong.');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <LinearGradient colors={['#EAD1DC', '#DCC6E0', '#C7CEEA']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.profilePicContainer}>
          
            <Image
              source={require('../assets/default-avatar.jpg')}
              style={styles.profilePic}
            />
          
          <Text style={styles.changePicText}>My Profile</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            style={styles.inputField}
            value={username}
            onChangeText={setUsername}
            editable={isEditing}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput style={styles.inputField} value={email} editable={false} />
        </View>

        {showPasswordField && (
          <>


 <Text style={styles.inputLabel}>Reset Password</Text>
            <View>
              <TextInput
                style={styles.inputField}
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="Old password"
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeButton}>
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

            <View>
              <TextInput
                style={styles.inputField}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New password"
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeButton}>
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

            <View>
              <TextInput
                style={styles.inputField}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm Password"
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeButton}>
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



            <View style={styles.buttonRow}>
  <TouchableOpacity onPress={handlePasswordReset} style={[styles.saveButton, { flex: 1, marginRight: 5 }]}>
    <Text style={styles.saveButtonText}>Confirm</Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => {
      setShowPasswordField(false);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordVisible(false);
    }}
    style={[styles.saveButton, { flex: 1, marginLeft: 5 }]}
  >
    <Text style={styles.saveButtonText}>Cancel</Text>
  </TouchableOpacity>
</View>
          </>
        )}

        {isEditing && !showPasswordField && (
          <TouchableOpacity onPress={() => setShowPasswordField(true)} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Reset Password</Text>
          </TouchableOpacity>
        )}

        {isEditing ? (
          <TouchableOpacity onPress={handleSaveChanges} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={signOut} style={styles.editButton}>
          <Text style={styles.editButtonText}>Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDeleteAccount} style={styles.editButton}>
          <Text style={styles.editButtonText}>Delete Account</Text>
        </TouchableOpacity>

        
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  scrollContainer: { flexGrow: 1, justifyContent: 'flex-start' },
  profilePicContainer: { alignItems: 'center', marginBottom: 20 },
  profilePic: { width: 100, height: 100, borderRadius: 50 },
  changePicText: { marginTop: 10, color: '#4B0082', fontSize: 16, fontWeight: '600' },
  inputContainer: { width: '100%', marginBottom: 20 },
  inputLabel: { fontSize: 18, color: '#4B0082', fontWeight: 'bold' },
  inputField: {
    height: 40,
    borderColor: '#4B0082',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginTop: 10
  },
  saveButton: {
    backgroundColor: '#4B0082',
    padding: 15,
    borderRadius: 5,
    marginBottom: 5,
    marginTop: 20
  },
  saveButtonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  editButton: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 5,
    borderColor: '#4B0082',
    borderWidth: 1
  },
  editButtonText: { color: '#4B0082', textAlign: 'center', fontSize: 16 },
  eyeButton: { position: 'absolute', right: 10, top: 20 },
  eyeIcon: { width: 20, height: 20 },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  buttonRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 20,
},
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B0082',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '45%',
    justifyContent: 'center',
  },
  navButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 10 },
});

export default AccountScreen;
