import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, Button } from "react-native";
import { ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import API_BASE_URL from "../config";
//import voice1Audio from "../assets/audio/voice_1.wav";

const UploadDocumentScreen = ({ navigation }) => {
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const [sound, setSound] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);

  // Sample pre-trained voices (replace with actual voice names from your database)
  const voices = [{name: "Voice 1", file: require("../assets/audio/voice_1.wav")}, {name: "Voice 2", file: require("../assets/audio/voice_2.wav")},];

  const [playingVoice, setPlayingVoice] = useState(null);


// Function to play a voice sample
const playVoiceSample = async (voice) => {
  try {
    if (playingVoice === voice.name && sound) {
      // If the same voice is playing, stop it
      await sound.stopAsync();
      setPlayingVoice(null);
      return;
    }

    if(sound){
      await sound.stopAsync();
      setPlayingVoice(null);
    }

    // Load the new sound
    const { sound: newSound } = await Audio.Sound.createAsync(
       voice.file, 
      { shouldPlay: true }
    );

    setSound(newSound);
    setPlayingVoice(voice.name);

    // When the sound finishes, reset playing state
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setPlayingVoice(null);
      }
    });
  } catch (error) {
    console.error("Error playing voice sample:", error);
  }
};

// Function to stop playback when closing modal
const closeModal = () => {
  if (sound) {
    sound.stopAsync();
  }
  setModalVisible(false);
};

const handleUpload = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ],
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      Alert.alert("No File Selected", "You canceled the document selection.");
      return;
    }

    const pickedFile = result.assets[0];
    setFileSelected(true);
    setFileName(pickedFile.name);
    setFile(pickedFile);

  } catch (error) {
    Alert.alert("Error", "An error occurred while picking the document.");
    console.error(error);
  }
};


  const handleVoiceSelect = (voice) => {
    setSelectedVoice(voice);
    setModalVisible(false);
    Alert.alert("Voice Selected", `You selected: ${voice}`);
  };

const handleProcessDocument = async () => {
  if (!fileSelected || !selectedVoice) {
    Alert.alert("Missing Selection", "Please select a document and a voice before proceeding.");
    return;
  }

  setIsLoading(true);

  try {
    let fileUri = file.uri;
    let fileName = file.name || "document.pdf";
    let mimeType = file.mimeType || "application/pdf";

    // Convert content:// URI to local file path if needed
    if (fileUri.startsWith("content://")) {
      const destPath = `${FileSystem.cacheDirectory}${fileName}`;
      await FileSystem.copyAsync({ from: fileUri, to: destPath });
      fileUri = destPath;
    }

    const formData = new FormData();
    formData.append("file", { uri: fileUri, type: mimeType, name: fileName });

    const endpoint =
      selectedVoice === "Voice 1"
        ? `${API_BASE_URL}/process-doc-voice1`
        : `${API_BASE_URL}/process-doc-voice2`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to process document");

    const blob = await response.blob();

    // Convert blob to Base64 and save locally
    const fileReader = new FileReader();
    fileReader.onloadend = async () => {
      const base64Data = fileReader.result.split(",")[1];

      const timestamp = Date.now();
      const generatedAudioUri = FileSystem.documentDirectory + `generated_audio_${timestamp}.wav`;

      await FileSystem.writeAsStringAsync(generatedAudioUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setIsLoading(false);

      // Navigate to UD2Screen with the generated audio URI
      navigation.navigate("UD2Screen", {
        fileName,
        selectedVoice,
        generatedAudioUri, // updated name
      });
    };

    fileReader.readAsDataURL(blob);

  } catch (error) {
    setIsLoading(false);
    Alert.alert("Error", error.message || "An error occurred while processing the document.");
    console.error("Processing error:", error);
  }
};

  return (
    <LinearGradient colors={["#EAD1DC", "#DCC6E0", "#C7CEEA"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Upload Your Document</Text>
        <Text style={styles.instructions}>
          Convert your documents into audio! Upload a document, and we’ll help you bring it to life with audio narration.
          {"\n\n"}Supported formats: PDF, DOCX, TXT{"\n\n"}Start by selecting a file from your device.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleUpload}>
          <Ionicons name="cloud-upload-outline" size={24} color="#FFF" style={{ marginRight: 10 }} />
          <Text style={styles.buttonText}>Upload Document</Text>
        </TouchableOpacity>

        {fileSelected && (
          <View style={styles.feedback}>
            <Ionicons name="checkmark-circle-outline" size={30} color="green" />
            <Text style={styles.feedbackText}>File Selected: {fileName}</Text>
          </View>
        )}

        {fileSelected && (
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Ionicons name="mic" size={24} color="#FFF" style={{ marginRight: 10 }} />
            <Text style={styles.buttonText}>Select Voice</Text>
          </TouchableOpacity>
        )}

        

        {fileSelected && selectedVoice && (
          <TouchableOpacity style={[styles.processButton, isLoading && {backgroundColor: "#ccc"} ]} onPress={handleProcessDocument} disabled={isLoading}>

        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
           ) : (
           <>
           <Ionicons name="play-circle-outline" size={24} color="#FFF" style={{marginRight: 10}}/>
            <Text style={styles.buttonText}>Process Document</Text>
            </>
        )} 
            </TouchableOpacity>
        )}

        {/* Modal for selecting voice */}
        <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
  <View style={styles.modalBackdrop}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Voice Library</Text>

      <ScrollView horizontal contentContainerStyle={styles.voiceOptions}>
        {voices.map((voice, index) => (
          <View key={index} style={styles.voiceContainer}>
            <TouchableOpacity
            
              style={[
                styles.voiceButton,
                selectedVoice === voice.name && styles.selectedVoiceButton,
              ]}
              onPress={() => handleVoiceSelect(voice.name)}
            >
              <Text style={styles.voiceButtonText}>{voice.name}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => playVoiceSample(voice)} style={styles.playButton}>
              <Ionicons
                name={playingVoice === voice.name ? "pause-circle" : "play-circle"}
                size={30}
                color={playingVoice === voice.name ? "red" : "green"}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
      </ScrollView>
    </LinearGradient>
  );
};

// Styles with customizations to match the app's warm and welcoming theme
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4B0082", // Purple shade for a welcoming tone
    textAlign: "center",
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    color: "#4B0082", // Purple instructions text
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4B0082", // Dark purple background
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginTop: 30,
  },
processButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"center",
    backgroundColor: "#6A0DAD",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
},
  buttonText: {
    color: "#FFF", // White text
    fontSize: 16,
    fontWeight: "600",
  },
  feedback: {
    marginTop: 30,
    alignItems: "center",
  },
  feedbackText: {
    fontSize: 16,
    color: "green", // Green color for feedback
    marginTop: 5,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark backdrop
  },
  modalContent: {
    backgroundColor: "#FFF", // White background for the modal
    padding: 20,
    borderTopLeftRadius: 20, // Rounded top corners
    borderTopRightRadius: 20,
    shadowColor: "#000", // Shadow for the modal content
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#4B0082", // Purple title
  },
  voiceOptions: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection:'row',
    paddingHorizontal: 45,
  },
  voiceButton: {
    backgroundColor: "#D3D3D3", // Light gray background for buttons
    borderRadius: 50, // Circular buttons
    paddingVertical: 15,
    paddingHorizontal: 25,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedVoiceButton: {
    backgroundColor: "#4B0082", // Dark purple for selected voice button
  },
  voiceButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF", // White text for the voice button
  },
  closeButton: {
    backgroundColor: "#4B0082", // Purple background
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  
  closeButtonText: {
    color: "#FFF", // White text
    fontSize: 16,
    fontWeight: "600",
  },
  voiceContainer: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  playButton: {
    marginTop: 10,
    alignItems: "center",
  },
});

export default UploadDocumentScreen;