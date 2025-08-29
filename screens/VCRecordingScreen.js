import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-web';

const VCRecordingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  useEffect(() => {
    const backAction = () => {
      if (route.name === "VCRecordingScreen") {
        navigation.replace("VoiceCloning2Screen");
      } else {
        navigation.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation, route]);

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
      if (intervalId) clearInterval(intervalId);
    };
  }, [sound, intervalId]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const startRecording = async () => {
  try {
    setAudioUri(null);
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) return alert('Permission to access microphone is required!');

    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

    const { recording } = await Audio.Recording.createAsync({
      android: {
        extension: '.wav',
        outputFormat: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
        sampleRate: 22050,
        numberOfChannels: 1,
        bitRate: 256000,
      },
      ios: {
        extension: '.wav',
        outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
        sampleRate: 22050,
        numberOfChannels: 1,
        bitRate: 256000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
      isMeteringEnabled: true,
    });

    setRecording(recording);
    setIsRecording(true);
    setRecordingDuration(0);

    const id = setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);
    setIntervalId(id);

  } catch (err) {
    console.error('Failed to start recording:', err);
  }
};

  const stopRecording = async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setAudioUri(uri);
    setRecording(null);
    setIsRecording(false);
    clearInterval(intervalId);
    setIntervalId(null);
  };

  const handleRecordingPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playAudio = async () => {
    if (!audioUri) return;

    const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
    setSound(sound);
    setIsPlaying(true);
    setPlaybackTime(0);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPlaybackTime(0);
      } else if (status.isPlaying) {
        setPlaybackTime(Math.floor(status.positionMillis / 1000));
      }
    });

    await sound.playAsync();
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      setPlaybackTime(0);
    }
  };

  const proceedToNext = () => {
    navigation.navigate("TextInputScreen", { audioUri });
  };

  return (
    <LinearGradient colors={['#EAD1DC', '#DCC6E0', '#C7CEEA']} style={styles.container}>
    <ScrollView>
      <View style={styles.body}>
        <Text style={styles.headerText}>
          Please record your voice using any text of your own choice or from the example text below for at least 6 or more seconds
        </Text>

        <View style={styles.exampleContainer}>
          <Text style={styles.exampleText}>
            One of the most common mistakes people make is bargaining with how the world should work instead of accepting how it does work 
            and complain like “that’s not right”, “that’s not fair,” or “it shouldn’t be that way”. 
            They want the world to work in a way that it doesn’t.
          </Text>
        </View>

        {/* Record / Record Again */}
        <TouchableOpacity style={styles.recordButton} onPress={handleRecordingPress}>
          <Ionicons name={isRecording ? "stop-circle-outline" : "mic-outline"} size={50} color="#fff" />
          <Text style={styles.recordText}>
            {isRecording ? "Stop Recording" : audioUri ? "Record Again" : "Start Recording"}
          </Text>
        </TouchableOpacity>

        {/* Recording Duration */}
        {isRecording && (
          <Text style={styles.recordingDuration}>Recording Time: {formatTime(recordingDuration)}</Text>
        )}

        {/* Audio Playback & Duration */}
        {audioUri && !isRecording && (
          <>
            <View style={styles.audioControls}>
              <TouchableOpacity style={styles.button} onPress={isPlaying ? stopAudio : playAudio}>
                <Ionicons name={isPlaying ? "stop-circle-outline" : "play-circle-outline"} size={30} color="#fff" />
                <Text style={styles.buttonText}>{isPlaying ? "Stop" : "Play"}</Text>
              </TouchableOpacity>
            </View>
            {isPlaying && (
              <Text style={styles.recordingDuration}>Playing Time: {formatTime(playbackTime)}</Text>
            )}

            <TouchableOpacity style={styles.nextButton} onPress={proceedToNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  headerText: {
    backgroundColor: '#FFFFFF', color: '#4B0082',    padding: 15,    borderRadius: 10,    fontSize: 16,    textAlign: 'center',    lineHeight: 22,    fontWeight: '600',    shadowColor: '#000',    shadowOffset: { width: 0, height: 2 },    shadowOpacity: 0.1,    shadowRadius: 4,
  },
  exampleContainer: {
    backgroundColor: '#FFFFFF',    padding: 15,    borderRadius: 10,    shadowColor: '#000',    shadowOffset: { width: 0, height: 4 },    shadowOpacity: 0.1,    shadowRadius: 6,
  },
  exampleText: {
    color: '#4B0082',    fontSize: 16,    lineHeight: 24,    textAlign: 'justify',
  },
  recordButton: {
    backgroundColor: '#4B0082',    paddingVertical: 20,    borderRadius: 15,    alignItems: 'center',    shadowColor: '#000',    shadowOffset: { width: 0, height: 4 },    shadowOpacity: 0.2,    shadowRadius: 6,
  },
  recordText: {
    color: '#FFFFFF',    fontSize: 16,    fontWeight: '600',    textTransform: 'uppercase',    marginTop: 5,
  },
  recordingDuration: {
    color: '#4B0082',    fontSize: 18,    fontWeight: '500',    textAlign: 'center',    marginTop: 10,
  },
  audioControls: {
    flexDirection: 'row',    justifyContent: 'center',    marginTop: 20,
  },
  button: {
    backgroundColor: '#4B0082',    padding: 15,    borderRadius: 10,    alignItems: 'center',    marginHorizontal: 10,
  },
  buttonText: {
    color: '#FFFFFF',    fontSize: 14,    fontWeight: '600',    marginTop: 5,
  },
  nextButton: {
    backgroundColor: '#6A0DAD',    padding: 15,    borderRadius: 10,    marginTop: 20,    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',    fontSize: 16,    fontWeight: 'bold',    textTransform: 'uppercase',
  },
});

export default VCRecordingScreen;
