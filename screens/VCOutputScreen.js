import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from "../config";

const VCOutputScreen = ({ route, navigation }) => {
  const { clonedAudioUri, clonedText } = route.params || {}; 
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

async function togglePlayback() {
  if (!clonedAudioUri) return;

  if (isPlaying && sound) {
    await sound.stopAsync();
    await sound.unloadAsync();
    setSound(null);
    setIsPlaying(false);
  } else {
    const { sound: newSound } = await Audio.Sound.createAsync({ uri: clonedAudioUri });
    setSound(newSound);
    setIsPlaying(true);
    await newSound.playAsync();

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        newSound.unloadAsync();
        setIsPlaying(false);
        setSound(null);
      }
    });
  }
}

  async function saveAudioToDatabase() {

    setIsLoading(true); 
    
    if (!clonedAudioUri) {
      alert("No audio available to save.");
      return;
    }
    
    try{
      const token = await AsyncStorage.getItem('token');
      console.log("Retrieved token:", token);

      const timestamp = Date.now();
      const fileName = `cloned_audio_${timestamp}.wav`;

const formData = new FormData();
formData.append("token", token);
formData.append("fileName",fileName)
formData.append("file", {
  name: fileName,
  type: "audio/wav",
  uri: clonedAudioUri,
});

 const response = await fetch(`${API_BASE_URL}/save-cloned-audio`, {
  method: "POST",
  body: formData,
 });
        
      const result = await response.json();
      if(result.success){
        alert("Audio saved successfully!");
        setIsLoading(false);
        navigation.navigate("Main", { screen: "My Files" });
      }else{
        alert("Failed to save audio!");
        setIsLoading(false);
      }
    }catch(error){
      setIsLoading(false);
      console.error("Error saving audio:", error);
      alert("Error Saving Audio");
    }
  }

  return (
    <LinearGradient colors={["#EAD1DC", "#DCC6E0", "#C7CEEA"]} style={styles.container}>
      <Text style={styles.headerText}>Cloned Audio</Text>

      <View style={styles.audioContainer}>
      {clonedText ? <Text style={styles.clonedText}>{clonedText}</Text> : null}

        {clonedAudioUri ? (
          <View style={styles.audioControls}>
  <TouchableOpacity style={styles.audioButton} onPress={togglePlayback}>
    <Ionicons
      name={isPlaying ? "pause-circle" : "play-circle"}
      size={60}
      color="white"
    />
    
  </TouchableOpacity>
</View>
        ) : (
          <Text style={styles.noAudioText}>No audio available</Text>
        )}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveAudioToDatabase}>
        {isLoading ? (<ActivityIndicator color="white"/>) : (<Text style={styles.buttonText}>Save to My Files</Text>)}
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4B0082",
    textAlign: "center",
    marginBottom: 20,
  },
  audioContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 20,
  },
  generatedText: {
    color: "#4B0082",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "justify",
    marginBottom: 10,
  },
  audioControls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  audioButton: {
    backgroundColor: "#4B0082",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginTop: 5,
  },
  noAudioText: {
    color: "#4B0082",
    textAlign: "center",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#4B0082",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
};

export default VCOutputScreen;
