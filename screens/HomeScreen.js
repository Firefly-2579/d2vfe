import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Main", { screen: "Voice Cloning" }); 
      return true; 
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove(); 
  }, [navigation]);

  return (
    <LinearGradient
      colors={["#EAD1DC", "#DCC6E0", "#C7CEEA"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <Text style={styles.welcomeText}>Welcome to D2V</Text>

      <ScrollView contentContainerStyle={styles.instructionsContainer}>
        <Text style={styles.instructions}>
          Are you using the application for the first time? Don't worry, we've got you! 
          {"\n\n"}- If you want to clone your own voice, opt for "Voice Cloning".
          {"\n\n"}- Otherwise, continue by "Upload Doc".
          {"\n\n"}- "My Files" will show your generated voices or documents.
          {"\n\n"}Hope you enjoy this experience!
        </Text>
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Main", { screen: "Voice Cloning" })} 
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="mic-outline" size={28} color="#4B0082" />
          </View>
          <Text style={styles.navText}>Voice Cloning</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Main", { screen: "Upload Document" })} 
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="cloud-upload-outline" size={28} color="#4B0082" />
          </View>
          <Text style={styles.navText}>Upload Document</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Main", { screen: "My Files" })} 
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="folder-outline" size={28} color="#4B0082" />
          </View>
          <Text style={styles.navText}>My Files</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Main", { screen: "My Account" })} 
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="person-outline" size={28} color="#4B0082" />
          </View>
          <Text style={styles.navText}>My Account</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 32,
    color: "#4B0082",
    fontWeight: "700",
    textAlign: "center",
    marginTop: 50,
    paddingHorizontal: 20,
    fontFamily: "sans-serif-medium",
  },
  instructionsContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    marginTop: 20,
  },
  instructions: {
    fontSize: 16,
    color: "#4B0082",
    textAlign: "center",
    lineHeight: 24,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "#FFF",
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  iconWrapper: {
    backgroundColor: "#EAD1DC",
    borderRadius: 25,
    padding: 15,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navText: {
    color: "#4B0082",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});

export default HomeScreen;

