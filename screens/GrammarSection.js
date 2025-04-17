import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  useColorScheme,
  Platform,
  ScrollView,
  Pressable,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Tts from 'react-native-tts';
import { grammarExamples } from '../data/grammarData';

const { width, height } = Dimensions.get('window');
const isIPad = Platform.OS === 'ios' && Platform.isPad;

const languages = [
  { code: 'korean', name: '한국어', icon: '🇰🇷' },
  { code: 'en', name: 'English', icon: '🇺🇸' },
  { code: 'ja', name: '日本語', icon: '🇯🇵' },
  { code: 'zh', name: '中文', icon: '🇨🇳' },
  { code: 'vi', name: 'Tiếng Việt', icon: '🇻🇳' },
];

const GrammarSection = ({ navigation }) => {
  const [showGrammar, setShowGrammar] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGrammarModal, setShowGrammarModal] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('korean');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

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
        }

      } catch (error) {
        console.warn('TTS 초기화 오류:', error);
      }
    };

    initTTS();
    
    Tts.addEventListener('tts-start', () => setIsSpeaking(true));
    Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
    Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));

    return () => {
      Tts.removeAllListeners();
    };
  }, []);

  const speakText = async (text) => {
    try {
      if (isSpeaking) {
        if (Platform.OS === 'ios') {
          await Tts.stop().then(() => {
            console.log('TTS stopped');
          });
        } else {
          await Tts.stop();
        }
      }

      if (Platform.OS === 'android') {
        await Tts.speak(text);
      } else {
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

  const resetGrammarState = () => {
    setShowGrammar(false);
    setCurrentIndex(0);
    setShowGrammarModal(false);
    setShowExample(false);
    setShowTranslation(false);
    setShowLanguageModal(false);
  };

  const handleNext = () => {
    if (currentIndex < grammarExamples.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowGrammarModal(true);
      setShowExample(false);
      setShowTranslation(true);
      setTimeout(() => {
        speakText(grammarExamples[currentIndex + 1].grammar);
      }, 100);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowGrammarModal(true);
      setShowExample(false);
      setShowTranslation(true);
      setTimeout(() => {
        speakText(grammarExamples[currentIndex - 1].grammar);
      }, 100);
    }
  };

  const handleReplay = () => {
    setShowGrammarModal(true);
    setShowExample(false);
    setShowTranslation(true);
    setTimeout(() => {
      speakText(grammarExamples[currentIndex].grammar);
    }, 100);
  };

  const handleExamplePress = () => {
    speakText(grammarExamples[currentIndex].example);
    setShowTranslation(true);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setShowLanguageModal(false);
    setShowGrammar(true);
    setShowGrammarModal(true);
    setShowExample(false);
    setShowTranslation(true);
    setTimeout(() => {
      speakText(grammarExamples[0].grammar);
    }, 100);
  };

  const highlightGrammarInSentence = (sentence, grammar) => {
    const parts = sentence.split(grammar);
    return (
      <Text style={[styles.exampleText, { color: theme.textColor }]}>
        {parts.map((part, index) => (
          <Text key={index}>
            {part}
            {index < parts.length - 1 && (
              <Text style={{ color: 'red' }}>{grammar}</Text>
            )}
          </Text>
        ))}
      </Text>
    );
  };

  const highlightMeaning = (meaning, grammar) => {
    const parts = meaning.split(grammar);
    return (
      <Text style={styles.meaningText}>
        {parts.map((part, index) => (
          <Text key={index}>
            {part}
            {index < parts.length - 1 && (
              <Text style={{ color: 'red' }}>{grammar}</Text>
            )}
          </Text>
        ))}
      </Text>
    );
  };

  const getLanguageName = (lang) => {
    const languageNames = {
      korean: '한국어',
      en: 'English',
      ja: '日本語',
      zh: '中文',
      vi: 'Tiếng Việt',
    };
    return languageNames[lang] || lang;
  };

  const getTranslationText = (lang) => {
    if (lang === 'korean') {
      return '뜻';
    }
    return grammarExamples[currentIndex].translations[lang];
  };

  useLayoutEffect(() => {
    if (showGrammar) {
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
            onPress={resetGrammarState}
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
  }, [navigation, showGrammar, selectedLanguage]);

  useEffect(() => {
    if (showGrammarModal) {
      const timer = setTimeout(() => {
        setShowGrammarModal(false);
        setShowExample(true);
        setShowTranslation(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showGrammarModal]);

  if (!showGrammar) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => setShowLanguageModal(true)}
        >
          <Ionicons name="book" size={50} color={theme.textColor} />
          <Text style={[styles.text, { color: theme.textColor, marginTop: 10 }]}>
            문법 학습 시작하기
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
      {showGrammarModal ? (
        <View style={styles.grammarModal}>
          <Text style={styles.grammarText}>
            {grammarExamples[currentIndex].grammar}
          </Text>
          {selectedLanguage !== 'korean' && (
            <Text style={styles.meaningText}>
              {grammarExamples[currentIndex].meanings[selectedLanguage]}
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.exampleContainer}>
          <TouchableOpacity
            style={styles.exampleCard}
            onPress={handleExamplePress}
          >
            <Text style={[styles.exampleText, { color: theme.textColor }]}>
              {grammarExamples[currentIndex].example}
            </Text>
          </TouchableOpacity>
          
          {selectedLanguage !== 'korean' && (
            <View style={styles.translationsContainer}>
              <Text style={[styles.translationText, { color: theme.textColor }]}>
                {grammarExamples[currentIndex].translations[selectedLanguage]}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          onPress={handlePrev}
          style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
          disabled={currentIndex === 0}
        >
          <Ionicons name="chevron-back" size={24} color={theme.textColor} />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleReplay}
          style={styles.navButton}
        >
          <Ionicons name="reload" size={24} color={theme.textColor} />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleNext}
          style={[styles.navButton, currentIndex === grammarExamples.length - 1 && styles.disabledButton]}
          disabled={currentIndex === grammarExamples.length - 1}
        >
          <Ionicons name="chevron-forward" size={24} color={theme.textColor} />
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
    fontSize: isIPad ? 24 : 18,
    marginTop: 10,
  },
  closeButton: {
    marginLeft: 15,
  },
  grammarModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grammarText: {
    color: 'white',
    fontSize: isIPad ? 60 : 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  meaningText: {
    color: 'white',
    fontSize: isIPad ? 40 : 24,
    textAlign: 'center',
  },
  exampleContainer: {
    flex: 1,
    width: '100%',
    padding: isIPad ? 20 : 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  exampleCard: {
    width: isIPad ? '90%' : '95%',
    padding: isIPad ? 25 : 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    minHeight: 'auto',
  },
  exampleText: {
    fontSize: isIPad ? 48 : 28,
    textAlign: 'center',
    lineHeight: isIPad ? 72 : 42,
    padding: isIPad ? 15 : 10,
    textDecorationLine: 'none',
  },
  translationsContainer: {
    width: isIPad ? '90%' : '95%',
    padding: isIPad ? 25 : 15,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    minHeight: 'auto',
    alignItems: 'center',
  },
  translationText: {
    fontSize: isIPad ? 32 : 16,
    lineHeight: isIPad ? 48 : 24,
    textAlign: 'center',
    padding: isIPad ? 15 : 10,
    textDecorationLine: 'none',
  },
  navigationContainer: {
    position: 'absolute',
    bottom: isIPad ? 40 : 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  navButton: {
    padding: isIPad ? 20 : 15,
    marginHorizontal: isIPad ? 20 : 10,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.3,
  },
  mainButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: isIPad ? 30 : 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    padding: isIPad ? 30 : 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: isIPad ? 36 : 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: isIPad ? 30 : 20,
  },
  languageButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageButton: {
    marginRight: 15,
    padding: 8,
    borderRadius: 5,
  },
  languageButtonText: {
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
});

export default GrammarSection; 