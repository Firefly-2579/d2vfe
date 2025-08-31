import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const SecondScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.tagline}>
          The Best <Text style={styles.highlight}>Document to voice</Text> convertor
        </Text>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.webp')} 
            style={styles.logo}
          />
        </View>
      </View>
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => navigation.navigate('SigninScreen')} 
        >
          <Text style={styles.buttonText}>Sign In</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate('SignupScreen')} 
        >
          <Text style={styles.buttonText}>Sign Up</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3', 
  },
  topSection: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  tagline: {
    flex: 0.1,
    fontSize: 20,
    textAlign: 'center',
    color: '#4B0082', 
    marginBottom: 20,
  },
  highlight: {
    color: '#6A0DAD', 
    fontWeight: 'bold',
  },
  logoContainer: {
    width: 200,
    height: 200,
    borderRadius: 500,
    overflow: 'hidden',
    backgroundColor: '#6A0DAD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  bottomSection: {
    flex: 1.5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
     borderWidth: 2,
    backgroundColor: '#6A0DAD', 
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    width: '80%',
    marginTop:-150,
  },
  signUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    backgroundColor: '#6A0DAD',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    width: '80%',
    marginBottom: 150,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF', 
  },
  arrow: {
    fontSize: 20,
    color: '#FFFFFF', 
  },
});

export default SecondScreen;
