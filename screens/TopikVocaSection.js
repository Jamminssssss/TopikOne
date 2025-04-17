import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  Platform,
  Modal,
  Pressable,
  ScrollView,
  SafeAreaView,
} from "react-native";
import vocabulary from '../data/vocabulary';
import Tts from 'react-native-tts';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const isIPad = Platform.OS === 'ios' && Platform.isPad;

const languages = [
  { code: 'korean', name: '한국어', icon: '🇰🇷' },
  { code: 'english', name: 'English', icon: '🇺🇸' },
  { code: 'japanese', name: '日本語', icon: '🇯🇵' },
  { code: 'chinese', name: '中文', icon: '🇨🇳' },
  { code: 'vietnamese', name: 'Tiếng Việt', icon: '🇻🇳' },
];

const VocaSection = ({ navigation }) => {
  const [showVoca, setShowVoca] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('korean');
  const [showTranslation, setShowTranslation] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // 다크모드 감지 hook 사용
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // 다크모드에 따른 색상 테마 설정
  const theme = {
    backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
    textColor: isDarkMode ? '#FFFFFF' : '#000000',
    cardBackground: isDarkMode ? '#222' : 'white',
    primaryButtonColor: isDarkMode ? '#1a6bb8' : '#2196F3',
    modalBackground: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
    modalContentBackground: isDarkMode ? '#333' : '#fff',
  };

  useEffect(() => {
    // TTS 초기 설정
    const initTTS = async () => {
      try {
        // 사용 가능한 음성 확인
        const voices = await Tts.voices();
        console.log('Available voices:', voices);
        
        // 기본 언어 설정
        await Tts.setDefaultLanguage('ko-KR');
        
        // 플랫폼별 설정
        if (Platform.OS === 'android') {
          // 안드로이드에서는 한국어 음성 엔진 찾기
          const koreanVoice = voices.find(
            voice => voice.language.includes('ko') && voice.networkConnectionRequired === false
          );
          if (koreanVoice) {
            await Tts.setDefaultVoice(koreanVoice.id);
          }
          await Tts.setDefaultRate(0.5);
          await Tts.setDefaultPitch(1.0);
        } else {
          // iOS의 경우
          const koreanVoice = voices.find(voice => voice.language === 'ko-KR');
          if (koreanVoice) {
            await Tts.setDefaultVoice(koreanVoice.id);
          }
          // iOS에서는 rate를 설정하지 않음
        }

      } catch (error) {
        console.warn('TTS 초기화 오류:', error);
      }
    };

    initTTS();
    
    const ttsStartListener = Tts.addEventListener('tts-start', () => setIsSpeaking(true));
    const ttsFinishListener = Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
    const ttsCancelListener = Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));

    return () => {
      if (ttsStartListener) ttsStartListener.remove();
      if (ttsFinishListener) ttsFinishListener.remove();
      if (ttsCancelListener) ttsCancelListener.remove();
    };
  }, []);

  const speakText = async (text) => {
    try {
      if (isSpeaking) {
        await Tts.stop();
      }

      // 플랫폼별 설정으로 speak 호출
      if (Platform.OS === 'android') {
        await Tts.speak(text);
      } else {
        // iOS의 경우 rate를 0.4로 설정 (iOS는 0.0 ~ 1.0 사이의 값 사용)
        const options = {
          iosVoiceId: 'com.apple.ttsbundle.Yuna-compact',
          rate: 0.4,
          language: 'ko-KR'
        };
        await Tts.speak(text, options);
      }
    } catch (error) {
      console.warn('TTS 발화 오류:', error);
    }
  };

  const resetVocaState = () => {
    setShowVoca(false);
    setCurrentIndex(0);
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
    speakText(vocabulary[currentIndex].korean);
    if (selectedLanguage !== 'korean') {
      setShowTranslation(!showTranslation);
    }
  };

  const getLanguageName = (lang) => {
    const languageNames = {
      korean: '한국어',
      english: 'English',
      chinese: '中文',
      japanese: '日本語',
      vietnamese: 'Tiếng Việt',
    };
    return languageNames[lang] || lang;
  };

  const getTranslationText = (lang) => {
    if (lang === 'korean') {
      return '뜻';
    }
    return vocabulary[currentIndex].translations[lang];
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
        headerRight: () => (
          <TouchableOpacity
            onPress={() => setShowLanguageModal(true)}
            style={styles.languageButton}
          >
            <Text style={[styles.languageButtonText, { color: theme.textColor }]}>
              {getLanguageName(selectedLanguage)}
            </Text>
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions({
        headerShown: false,
        tabBarStyle: { display: 'flex' },
      });
    }
  }, [navigation, showVoca, selectedLanguage]);

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setShowLanguageModal(false);
    setShowVoca(true);
    setShowTranslation(false);
  };

  if (!showVoca) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => setShowLanguageModal(true)}
        >
          <Ionicons name="book" size={50} color={theme.textColor} />
          <Text style={[styles.text, { color: theme.textColor, marginTop: 10 }]}>
            단어 학습 시작하기
          </Text>
        </TouchableOpacity>

        <Modal
          visible={showLanguageModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowLanguageModal(false)}
        >
          <SafeAreaView style={[styles.fullScreenModal, { backgroundColor: theme.modalBackground }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={() => setShowLanguageModal(false)}
                style={styles.closeModalButton}
              >
                <Ionicons name="close" size={30} color={theme.textColor} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.centeredContent}>
              <Text style={[styles.modalTitle, { color: theme.textColor }]}>
                언어를 선택하세요
              </Text>
              
              <View style={styles.languageButtonsContainer}>
                {languages.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.languageSelectButton,
                      { backgroundColor: isDarkMode ? '#444' : '#f0f0f0' }
                    ]}
                    onPress={() => handleLanguageSelect(lang.code)}
                  >
                    <Text style={styles.languageIcon}>{lang.icon}</Text>
                    <Text style={[styles.languageText, { color: theme.textColor }]}>
                      {lang.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.cardBackground }]}
          onPress={handleCardPress}
        >
          <Text style={[styles.cardText, { color: theme.textColor }]}>
            {vocabulary[currentIndex].korean}
          </Text>
          {showTranslation && selectedLanguage !== 'korean' && (
            <Text style={[styles.translationText, { color: theme.textColor }]}>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginTop: 10,
  },
  closeButton: {
    marginLeft: 15,
  },
  languageButton: {
    marginRight: 15,
    padding: 8,
    borderRadius: 5,
  },
  languageButtonText: {
    fontSize: 16,
  },
  cardContainer: {
    width: '90%',
    height: 250,
    marginBottom: 30,
  },
  card: {
    width: '100%',
    height: '100%',
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
    textAlign: 'center',
    marginBottom: 20,
  },
  translationText: {
    fontSize: 30,
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
  fullScreenModal: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 20,
    paddingRight: 20,
  },
  closeModalButton: {
    padding: 10,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  languageButtonsContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageSelectButton: {
    width: '100%',
    maxWidth: 300,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  languageIcon: {
    fontSize: 30,
    marginRight: 20,
  },
  languageText: {
    fontSize: 18,
    fontWeight: '500',
  },
  mainButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VocaSection;