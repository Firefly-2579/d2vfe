import React, { useEffect } from 'react';
import logo from '../assets/logo.webp';

import { View, Text, StyleSheet, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('WelcomeScreen'); 
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.webp')} 
        style={styles.backgroundImage} 
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
    justifyContent: 'flex-end', 
    alignItems: 'center',
    backgroundColor: '#6A0DAD', 
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover', 
  },
  overlay: {
    alignItems: 'center',
    paddingBottom: 40, 
  },
  title: {
    fontSize: 24, 
    color: '#FFFFFF',
    marginBottom: 10, 
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16, 
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10, 
  },
  textContainer: {
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});

export default SplashScreen;