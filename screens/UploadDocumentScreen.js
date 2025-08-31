import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, Button } from "react-native";
import { ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import API_BASE_URL from "../config";

const UploadDocumentScreen = ({ navigation }) => {
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const [sound, setSound] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);

  const voices = [{name: "Voice 1", file: require("../assets/audio/voice_1.wav")}, {name: "Voice 2", file: require("../assets/audio/voice_2.wav")},];

  const [playingVoice, setPlayingVoice] = useState(null);

const playVoiceSample = async (voice) => {
  try {
    if (playingVoice === voice.name && sound) {
      await sound.stopAsync();
      setPlayingVoice(null);
      return;
    }

    if(sound){
      await sound.stopAsync();
      setPlayingVoice(null);
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
       voice.file, 
      { shouldPlay: true }
    );

    setSound(newSound);
    setPlayingVoice(voice.name);

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setPlayingVoice(null);
      }
    });
  } catch (error) {
    console.error("Error playing voice sample:", error);
  }
};

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

    if (!response.ok) {
      throw new Error("Failed to process document");
    }

    const blob = await response.blob();

    const fileReader = new FileReader();
    fileReader.onloadend = async () => {
      try {
      const base64Data = fileReader.result.split(",")[1];

      const timestamp = Date.now();
      const generatedAudioUri = FileSystem.documentDirectory + `generated_audio_${timestamp}.wav`;

      await FileSystem.writeAsStringAsync(generatedAudioUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setIsLoading(false);

      navigation.navigate("UD2Screen", {
        fileName,
        selectedVoice,
        generatedAudioUri, 
      });
      } catch (error) {
        setIsLoading(false);
         Alert.alert("Error", error.message || "Failed to generate audio");
         console.error("Processing error:", error);
      }   
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
          Convert your documents into audio! Upload a document, and we’ll help you bring it to life with audio narration.we request you to be patient as it may take few minutes to process file.
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
          <TouchableOpacity style={[styles.processButton, isLoading && {backgroundColor: "#ccc"}, ]} onPress={handleProcessDocument} disabled={isLoading}>

        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
           ) : (
          <Text style={styles.buttonText}>Process Document</Text>   
        )} 
            </TouchableOpacity>
        )}

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
    color: "#4B0082", 
    textAlign: "center",
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    color: "#4B0082", 
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4B0082", 
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
    shadowColor:"#000",
    shadowOffset:{width: 0, height: 4},
    shadowOpacity:0.2,
    shadowRadius:6,
    minWidth: 180,
},
  buttonText: {
    color: "#FFF", 
    fontSize: 16,
    fontWeight: "600",
  },
  feedback: {
    marginTop: 30,
    alignItems: "center",
  },
  feedbackText: {
    fontSize: 16,
    color: "green", 
    marginTop: 5,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  modalContent: {
    backgroundColor: "#FFF", 
    padding: 20,
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#4B0082", 
  },
  voiceOptions: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection:'row',
    paddingHorizontal: 45,
  },
  voiceButton: {
    backgroundColor: "#D3D3D3", 
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 25,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedVoiceButton: {
    backgroundColor: "#4B0082", 
  },
  voiceButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF", 
  },
  closeButton: {
    backgroundColor: "#4B0082", 
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  
  closeButtonText: {
    color: "#FFF", 
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