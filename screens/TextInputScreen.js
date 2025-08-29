import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import API_BASE_URL from "../config";
import * as FileSystem from "expo-file-system";
import { ActivityIndicator } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

const TextInputScreen = ({ navigation, route }) => {
  const [text, setText] = useState("");
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioUri = route.params?.audioUri || null;
  const [isLoading, setIsLoading] = useState(false);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  async function playAudio() {
    if (audioUri) {
      const { sound: playbackObject } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );

      setSound(playbackObject);
      setIsPlaying(true);

      playbackObject.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          playbackObject.unloadAsync();
          setSound(null);
        }
      });
    }
  }

  async function stopAudio() {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      await sound.unloadAsync();
      setSound(null);
    }
  }

async function uploadData() {
  if (!audioUri || !text.trim()) {
    alert("Please enter text and ensure an audio file is recorded.");
    return;
  }

  if (wordCount > 200) {
    alert("Text exceeds 200-word limit.");
    return;
  }

  const formData = new FormData();
  formData.append("speaker_wav", {
    uri: audioUri,
    name: "recorded_audio.wav",
    type: "audio/wav",
  });
  formData.append("text", text);

  try {
    setIsLoading(true); // Start loading

    const response = await fetch(`${API_BASE_URL}/process-voice`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.ok) {
      throw new Error("Server Error");
    }

    const blob = await response.blob();

    const fileReader = new FileReader();
    fileReader.onloadend = async () => {
      const base64Data = fileReader.result.split(",")[1];

      const fileUri = FileSystem.documentDirectory + "cloned_audio.wav";
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setIsLoading(false); // Stop loading
      navigation.navigate("VCOutputScreen", {
        clonedAudioUri: fileUri,
        clonedText: text,
      });
    };

    fileReader.readAsDataURL(blob);
  } catch (error) {
    console.error("Upload error", error);
    alert("Failed to process audio");
    setIsLoading(false); // Stop loading on error
  }
}


  return (
  <LinearGradient colors={["#EAD1DC", "#DCC6E0", "#C7CEEA"]} style={styles.container}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // ✅ Corrected logic
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // ✅ Helps prevent overlap
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.body}>
            <Text style={styles.headerText}>Recorded Audio</Text>

            {audioUri ? (
              <View style={styles.audioControls}>
                {!isPlaying ? (
                  <TouchableOpacity style={styles.button} onPress={playAudio}>
                    <Ionicons name="play-circle-outline" size={30} color="#fff" />
                    <Text style={styles.buttonText}>Play</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.button} onPress={stopAudio}>
                    <Ionicons name="stop-circle-outline" size={30} color="#fff" />
                    <Text style={styles.buttonText}>Stop</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <Text style={styles.noAudioText}>No recorded audio found.</Text>
            )}

            <Text style={styles.headerText}>Enter Text (max 200 words)</Text>

            <View style={styles.textInputWrapper}>
              <TextInput
                style={styles.textInput}
                multiline
                scrollEnabled={true}
                textAlignVertical="top"
                placeholder="Enter text here..."
                placeholderTextColor="#8A2BE2"
                value={text}
                onChangeText={setText}
              />
              <Text style={styles.wordCount}>{wordCount} / 200</Text>
            </View>
<TouchableOpacity
  style={[
    styles.uploadButton,
    (wordCount > 200 || isLoading) && { backgroundColor: "#ccc" },
  ]}
  onPress={uploadData}
  disabled={wordCount > 200 || isLoading}
>
  {isLoading ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Text style={styles.uploadButtonText}>Upload & Process</Text>
  )}
</TouchableOpacity>

          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  </LinearGradient>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
  },
  headerText: {
    backgroundColor: "#FFFFFF",
    color: "#4B0082",
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "600",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 10,
  },
  
  scrollContainer: {
    flexGrow: 1,
  },

  audioControls: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    
  },
  button: {
    backgroundColor: "#4B0082",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
  },
  noAudioText: {
    color: "#4B0082",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  textInputWrapper: {
    position: "relative",
    marginTop: 30,
    marginBottom:10,
  },
  textInput: {
    borderWidth: 2,
    borderColor: "#4B0082",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "white",
    color: "#4B0082",
    fontSize: 16,
    minHeight: 120,
    maxHeight: 200, // ✅ limit maximum height so input doesn't expand endlessly
    textAlignVertical: "top", // ✅ keeps text aligned to top
  },
  wordCount: {
    position: "absolute",
    top: 8,
    right: 10,
    color: "#4B0082",
    fontSize: 12,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 6,
    borderRadius: 5,
  },
  uploadButton: {
    backgroundColor: "#6A0DAD",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

export default TextInputScreen;
