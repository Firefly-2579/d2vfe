import React, { useEffect } from 'react';
import logo from '../assets/logo.webp';

import { View, Text, StyleSheet, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Navigate to the next screen after 20 seconds
    const timer = setTimeout(() => {
      navigation.replace('WelcomeScreen'); // Replace with your desired screen
    }, 4000);
    return () => clearTimeout(timer); // Cleanup the timer
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.webp')} 
        style={styles.backgroundImage} // Make the logo fill the background
      />
      <View style={styles.overlay}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>DocumentToVoice</Text>
        </View>
        <Text style={styles.subtitle}>The ultimate AI Voice Generator</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', // Align content at the bottom of the screen
    alignItems: 'center',
    backgroundColor: '#6A0DAD', // Purple background
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ensure the image fills the screen
  },
  overlay: {
    alignItems: 'center',
    paddingBottom: 40, // Space between the content and the bottom
  },
  title: {
    fontSize: 24, // Title size
    color: '#FFFFFF',
    marginBottom: 10, // Space between microphone and title
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16, // Subtitle size
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10, // Space above subtitle
  },
  textContainer: {
    flexDirection: 'row', // Align microphone and text horizontally
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});

export default SplashScreen;