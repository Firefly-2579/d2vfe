import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const VoiceCloningScreen = ({}) => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#EAD1DC', '#DCC6E0', '#C7CEEA']} style={styles.container}>
      

      <View style={styles.body}>
        <View style={styles.voiceClone}>
          <Text style={styles.voiceCloneText}>Voice Cloning</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("VoiceCloning2Screen") }
        >
          <Text style={styles.buttonText}>+ Create a New Clone</Text>
        </TouchableOpacity>
      </View>

      
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  button: {
    backgroundColor: "#4B0082",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  
});

export default VoiceCloningScreen;
