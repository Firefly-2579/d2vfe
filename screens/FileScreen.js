import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../config";
import { Audio } from "expo-av";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing'; 
import { Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const AudioPanel = ({route}) => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);

  useEffect(() => {
  return () => {
    if (sound) {
      sound.unloadAsync();
    }
  };
}, [sound]);

useFocusEffect(
  useCallback(() => {
    const fetchAudioFiles = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/get-user-audio`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();
        if (result.success) {
          const files = [
            ...result.generatedAudio.map((item) => ({
              id: item._id,
              title: item.fileName,
              uri: item.fileUri,
              type: "generated",
              userId: result.userId,
            })),
            ...result.clonedAudio.map((item) => ({
              id: item._id,
              title: item.fileName,
              uri: item.fileUri,
              type: "cloned",
              userId: result.userId,
            })),
          ];
          setAudioFiles(files);
        } else {
          Alert.alert("Error", "Failed to fetch audio files.");
        }
      } catch (error) {
        console.error("Error fetching audio files:", error);
      }
    };
    fetchAudioFiles();
  }, [])
);

const handleDelete = async (userId, type, id) => {
  console.log("Deleting:", userId, type, id);
  const res = await fetch(`${API_BASE_URL}/delete-audio/${userId}/${type}/${id}`, {
    method: "DELETE"
  });
  const result = await res.json();
  if (result.success) {
    Alert.alert("Deleted!", "Audio removed successfully.");
    setAudioFiles(audioFiles.filter(a => a.id !== id)); 
  } else {
    Alert.alert("Error", result.message);
  }
};

const handleExport = async (cloudUri, fileName) => {
  try {

      const localFile = `${FileSystem.cacheDirectory}${fileName}`;
      const {uri: localUri} = await FileSystem.downloadAsync(cloudUri, localFile);
    
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        alert('Permission not granted');
        return;
      }

      const newFileUri = await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        fileName.endsWith(".wav") ? fileName: `${fileName}.wav`,
        "audio/wav"
      );

      const fileData = await FileSystem.readAsStringAsync(localUri, { encoding: FileSystem.EncodingType.Base64, });
      await FileSystem.writeAsStringAsync(newFileUri, fileData, { encoding: FileSystem.EncodingType.Base64, });

      alert("File saved to the folder");
    } catch (err) {
    console.error('Export error:', err);
    alert('Failed to export file');
  }
};

const handlePlay = async (id, uri) => {
  try {
    if (sound && currentPlayingId === id) {
      const status = await sound.getStatusAsync();
      if (status.isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
      return;
    }
  
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );
    setSound(newSound);
    setCurrentPlayingId(id);
    setIsPlaying(true);

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish){
        setIsPlaying(false);
        setCurrentPlayingId(null);
        newSound.unloadAsync();
        setSound(null);
      }else{
        setIsPlaying(status.isPlaying);
      }
    });
  } catch (error) {
    console.error("Error playing audio:", error);
  }
};

  const renderEmptyMessage = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="musical-notes-outline" size={60} color="#A084CA" />
      <Text style={styles.emptyText}>No audio files found</Text>
      <Text style={styles.emptySubText}>
        Your saved audio files will appear here.
      </Text>
    </View>
  );

  return (
   <FlatList
  data={audioFiles}
  keyExtractor={(item) => item.id}
  extraData={{ currentPlayingId, isPlaying }} 
  renderItem={({ item }) => (
    <LinearGradient colors={["#EAD1DC", "#DCC6E0"]} style={styles.itemContainer}>
      <Text style={styles.itemText} numberOfLines={3} ellipsizeMode="tail">{item.title}</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity onPress={() => handlePlay(item.id, item.uri)}>
          <Ionicons
            name={isPlaying && currentPlayingId === item.id ? "pause-circle" : "play-circle"}
            size={24}
            color="#4B0082"
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => handleDelete(item.userId, item.type, item.id)}>
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => handleExport(item.uri, item.title)}>
          <Ionicons name="download" size={24} color="#008000" />
        </TouchableOpacity>

      </View>
    </LinearGradient>
  )}
  ListEmptyComponent={renderEmptyMessage}
  contentContainerStyle={audioFiles.length === 0 && { flex: 1, justifyContent: "center" }}
/>
  )}

const FileScreen = ({route}) => {
  return (
    <LinearGradient
      colors={["#EAD1DC", "#DCC6E0", "#C7CEEA"]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <AudioPanel  route={route} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DCC6E0",
  },
  itemText: {
    flex : 1,
    fontSize: 16,
    color: "#4B0082",
    fontWeight: "bold",
    marginRight: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 15,
    justifyContent : "flex-end",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4B0082",
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
});

export default FileScreen;