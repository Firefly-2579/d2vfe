import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity,ActivityIndicator, StyleSheet, BackHandler} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from "../config";

const UD2Screen = () => {

const navigation = useNavigation();
const route = useRoute();
const { generatedAudioUri } = route.params || {};
  useEffect(() => {
      const backAction = () => {
        if ( route.name === "UD2Screen") {  
          navigation.replace("UploadDocumentScreen");
        } else {
          navigation.goBack(); 
        }
        return true; 
      };
  
      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
  
      return () => backHandler.remove(); 
    }, [navigation, route]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlayPause = async () => {
    if (!sound) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: generatedAudioUri }, 
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isPlaying) setIsPlaying(false);
      });
    } else {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

async function saveAudioToDatabase() {
  
  setIsLoading(true); 

  if (!generatedAudioUri) {
    alert("No audio available to save.");
    return;
  }

  try {
    const token = await AsyncStorage.getItem('token');
    console.log("Retrieved token:", token);

    const timestamp = Date.now();
    const fileName = `generated_audio_${timestamp}.wav`;

    const formData = new FormData();
    formData.append("token", token);
    formData.append("fileName",fileName)
    formData.append("file", {
      name: fileName,
      type: "audio/wav",
      uri: generatedAudioUri,
    });

    const response = await fetch(`${API_BASE_URL}/save-generated-audio`, {
     method: "POST",
     body: formData, 
    });

    const result = await response.json();
    if (result.success) {
      
      alert("Audio saved successfully!");
      setIsLoading(false);
      navigation.navigate("Main", { screen: "My Files" });
    } else {
      alert("Failed to save audio!");
      setIsLoading(false);
    }
  } catch (error) {
    setIsLoading(false);
    console.error("Error saving audio:", error);
    alert("Error Saving Audio");
  }
}

  return (
    <LinearGradient colors={["#EAD1DC", "#DCC6E0", "#C7CEEA"]} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Generated Audio</Text>

        {/* Audio Controls */}
        <TouchableOpacity style={styles.audioButton} onPress={handlePlayPause}>
          <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={60} color="white" />
        </TouchableOpacity>
        
      </View>
       <TouchableOpacity style={styles.saveButton}  onPress={saveAudioToDatabase}>
        {isLoading ? (<ActivityIndicator color="white"/>) : (<Text style={styles.buttonText}>Save to My Files</Text>)}
        </TouchableOpacity>
     
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { width: "90%", padding: 20, backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: 15, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", color: "#4B0082", marginBottom: 20 },
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
  saveButton: {
    backgroundColor: "#4B0082",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    width: "90%"
  },
   buttonText: {
    color: "white",
    fontWeight: "bold",
    marginTop: 5,
  },

});

export default UD2Screen;
