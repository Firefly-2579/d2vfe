import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity,  BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from '@react-navigation/native';


const VoiceCloning2Screen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const backAction = () => {

      if ( route.name === "VoiceCloning2Screen") {  // Go back to VoiceCloningScreen
        navigation.replace("VoiceCloningScreen");
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
      <StatusBar barStyle="light-content" />
      
     
      <View style={styles.body}>
        <View style={styles.voiceClone}>
          <Text style={styles.voiceCloneText}>Cloning Your Voice</Text>
        </View>
        <View style={styles.record}>
          <View style={styles.microphone}>
            <Ionicons name="mic-outline" size={50} color="#673AB7" />
          </View>
          <Text style={styles.recordText}>Record</Text>
          
          <Text style={styles.recordDescription}>
            Record your voice with as little background noise as possible.
          </Text>
          <TouchableOpacity 
          style={styles.recordButton}
          onPress={() => navigation.navigate("VCRecordingScreen") }
          >
            <Text style={styles.recordButtonText}>Record Voice</Text>
          </TouchableOpacity>
        </View>
      </View>
      
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4B0082',
    padding: 15,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  voiceClone: {
    marginBottom: 30,
  },
  voiceCloneText: {
    color: '#4B0082',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  record: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    width: '90%',
  },
  microphone: {
    marginBottom: 15,
  },
  recordText: {
    fontSize: 18,
    color: '#4B0082',
    fontWeight: '600',
    textAlign: 'center',
  },
  recordDescription: {
    fontSize: 14,
    color: '#6A0DAD',
    textAlign: 'center',
    marginVertical: 10,
    lineHeight: 20,
  },
  recordButton: {
    backgroundColor: '#4B0082',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  recordButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  
});

export default VoiceCloning2Screen;
