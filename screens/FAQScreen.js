import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, BackHandler} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const FAQScreen = () => {
  const navigation = useNavigation();

  
    const route = useRoute();
  
    useEffect(() => {
      const backAction = () => {
        if ( route.name === "FAQScreen") {  // Go back to AccountScreen
          navigation.replace("AccountScreen");
        } else {
          navigation.goBack(); // default back behaviour for other screens 
        }
        return true; // Prevent default back navigation
      };
  
      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
  
      return () => backHandler.remove(); // Cleanup the listener on unmount
    }, [navigation, route]);
  

  // List of FAQ questions & answers
  const faqs = [
    { 
      question: "What is this app used for?", 
      answer: "This app allows users to convert text documents into speech using AI-generated or cloned voices. Users can also download documents as audiobooks." 
    },
    { 
      question: "How do I upload a document for conversion?", 
      answer: "You can upload a document by selecting the 'Upload' button and choosing a file from your device. Supported formats include PDF, DOCX and TXT." 
    },
    { 
      question: "Can I use my own voice for text-to-speech conversion?", 
      answer: "Yes! You can clone your voice by providing a sample recording and use it for text-to-speech conversion by following the guidelines." 
    },
    { 
      question: "How do I reset my password?", 
      answer: "Go to your account settings, click on 'Reset Password,' enter new password, and press confirm." 
    },
    { 
      question: "Does the app support multiple languages?", 
      answer: "Unfortunately not at the moment but keep looking up to it." 
    },
    { 
      question: "Is the app free to use?", 
      answer: "Yes. The app is free to use for any anyone." 
    }
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  // Handle expanding/collapsing questions
  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <LinearGradient colors={['#EAD1DC', '#DCC6E0', '#C7CEEA']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Page Title */}
        <Text style={styles.title}>Frequently Asked Questions</Text>

        {/* FAQ List */}
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqContainer}>
            <TouchableOpacity onPress={() => toggleFAQ(index)} style={styles.questionContainer}>
              <Text style={styles.questionText}>{faq.question}</Text>
              <Ionicons 
                name={expandedIndex === index ? "chevron-up-outline" : "chevron-down-outline"} 
                size={24} 
                color="#4B0082" 
              />
            </TouchableOpacity>
            {expandedIndex === index && <Text style={styles.answerText}>{faq.answer}</Text>}
          </View>
        ))}

    

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    textAlign: 'center',
    marginBottom: 20,
  },
  faqContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B0082',
    flex: 1,
  },
  answerText: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
    lineHeight: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B0082',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default FAQScreen;
