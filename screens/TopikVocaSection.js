import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  Platform,
} from "react-native";
import vocabulary from '../data/vocabulary';
import Tts from 'react-native-tts';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const isIPad = Platform.OS === 'ios' && Platform.isPad;

const VocaSection = ({ navigation }) => {
  const [showVoca, setShowVoca] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 다크모드 감지 hook 사용
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // 다크모드에 따른 색상 테마 설정
  const theme = {
    backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
    textColor: isDarkMode ? '#FFFFFF' : '#000000',
    cardBackground: isDarkMode ? '#222' : 'white',
    primaryButtonColor: isDarkMode ? '#1a6bb8' : '#2196F3',
  };

  useEffect(() => {
    Tts.setDefaultLanguage('ko-KR');
    
    // TTS 이벤트 리스너 설정
    Tts.addEventListener('tts-start', () => setIsSpeaking(true));
    Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
    Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      Tts.removeAllListeners();
    };
  }, []);

  const resetVocaState = () => {
    setShowVoca(false);
    setCurrentIndex(0);
    setSelectedLanguage(null);
    setShowTranslation(false);
  };

  const handleNext = () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowTranslation(false);
    }
  };

  const handleCardPress = () => {
    if (!isSpeaking) {
      Tts.speak(vocabulary[currentIndex].korean);
    }
    setShowTranslation(!showTranslation);
  };

  useLayoutEffect(() => {
    if (showVoca) {
      navigation.setOptions({
        headerShown: true,
        tabBarStyle: { display: 'none' },
        headerTitle: '',
        headerStyle: {
          backgroundColor: theme.backgroundColor,
        },
        headerTintColor: theme.textColor,
        headerLeft: () => (
          <TouchableOpacity
            onPress={resetVocaState}
            style={styles.closeButton}
          >
            <Ionicons name="close-outline" size={30} color={theme.textColor} />
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions({
        headerShown: false,
        tabBarStyle: { display: 'flex' },
      });
    }
  }, [navigation, showVoca]);

  if (!showVoca) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <View style={styles.buttonContainer}>
          <Ionicons
            name="book"
            size={50}
            color={theme.textColor}
            onPress={() => setShowVoca(true)}
          />
          <Text style={[styles.text, { color: theme.textColor, marginTop: 10 }]}>
            Topik1 단어
          </Text>
        </View>
      </View>
    );
  }

  if (!selectedLanguage) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <Text style={[styles.languageTitle, { color: theme.textColor }]}>
          언어를 선택하세요
        </Text>
        <View style={styles.languageContainer}>
          {Object.keys(vocabulary[0].translations).map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.languageButton, 
                { backgroundColor: theme.primaryButtonColor },
                isIPad && {
                  width: width * 0.35,
                  height: height * 0.15,
                  padding: 30,
                  margin: 20,
                  borderRadius: 20,
                }
              ]}
              onPress={() => setSelectedLanguage(lang)}
            >
              <Text style={[
                styles.languageButtonText,
                isIPad && styles.languageButtonTextIPad
              ]}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#FFFFFF' }]}
          onPress={handleCardPress}
        >
          <Text style={styles.cardText}>
            {vocabulary[currentIndex].korean}
          </Text>
          {showTranslation && (
            <Text style={styles.translationText}>
              {vocabulary[currentIndex].translations[selectedLanguage]}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          onPress={handlePrev}
          style={[styles.button, currentIndex === 0 && styles.disabledButton]}
          disabled={currentIndex === 0}
        >
          <Text style={styles.buttonText}>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          style={[styles.button, currentIndex === vocabulary.length - 1 && styles.disabledButton]}
          disabled={currentIndex === vocabulary.length - 1}
        >
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  text: {
    fontSize: 18,
    marginTop: 10,
  },
  closeButton: {
    marginLeft: 15,
  },
  languageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
  },
  languageButton: {
    padding: 15,
    margin: 10,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  languageButtonTextIPad: {
    fontSize: 32,
    fontWeight: '600',
  },
  languageTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  cardContainer: {
    width: '90%',
    height: 250,
    marginBottom: 30,
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 20,
  },
  cardText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  translationText: {
    fontSize: 30,
    color: '#666666',
    textAlign: 'center',
    marginTop: 10,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default VocaSection;