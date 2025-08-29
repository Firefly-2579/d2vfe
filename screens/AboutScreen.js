import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, BackHandler } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute} from '@react-navigation/native';

const AboutScreen = () => {
  const navigation = useNavigation();

  const route = useRoute();
    
      useEffect(() => {
        const backAction = () => {
          if ( route.name === "AboutScreen") {  // Go back to AccountScreen
            navigation.replace("AccountScreen");
          } else {
            navigation.goBack(); // default back behaviour for other screens 
          }
          return true; // Prevent default back navigation
        };
    
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    
        return () => backHandler.remove(); // Cleanup the listener on unmount
      }, [navigation, route]);

  return (
    <LinearGradient colors={['#EAD1DC', '#DCC6E0', '#C7CEEA']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* App Logo */}
        <Image source={require('../assets/logo.webp')} style={styles.logo} />

        {/* App Name */}
        <Text style={styles.title}>Text-to-Speech Converter</Text>

        {/* Short Description */}
        <Text style={styles.description}>
          Convert your documents into speech using AI-generated voices or your own cloned voice. 
          Enjoy seamless document reading with audiobook downloads.
        </Text>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featureItem}>
            <Ionicons name="document-text-outline" size={22} color="#4B0082" />
            <Text style={styles.featureText}>Upload & convert documents to speech</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="headset-outline" size={22} color="#4B0082" />
            <Text style={styles.featureText}>Choose AI-generated or cloned voices</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="language-outline" size={22} color="#4B0082" />
            <Text style={styles.featureText}> Multiple voice options for text-to-speech</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="cloud-download-outline" size={22} color="#4B0082" />
            <Text style={styles.featureText}>Download converted speech as audiobooks</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="color-wand-outline" size={22} color="#4B0082" />
            <Text style={styles.featureText}>Save files in app or download it on device</Text>
          </View>
        </View>

        {/* App Version */}
        <Text style={styles.version}>Version 1.0.0</Text>


      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
    paddingHorizontal: 15,
  },
  featuresContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 30,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B0082',
    textAlign: 'center',
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  version: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 15,
  },
  
});

export default AboutScreen;
