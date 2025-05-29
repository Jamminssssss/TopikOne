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
  Animated,
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

const GrammarCard = ({ item, selectedLanguage, theme, speakText }) => {
  const [showExample, setShowExample] = useState(false);
  
  const handlePress = () => {
    setShowExample(!showExample);
    if (!showExample) {
      // Speak the example when showing it
      speakText(item.example);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.grammarCard,
        { backgroundColor: theme.cardBackground, borderColor: theme.primaryButtonColor }
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {!showExample ? (
        // Grammar view
        <View style={styles.grammarView}>
          <Text style={[styles.grammarText, { color: theme.textColor }]}>
            {item.grammar}
          </Text>
          {selectedLanguage !== 'korean' && (
            <Text style={[styles.meaningText, { color: theme.textColor }]}>
              {item.meanings[selectedLanguage]}
            </Text>
          )}
          <Text style={styles.tapInstruction}>
            <Ionicons name="hand-left" size={16} color={theme.textColor} /> 탭하여 예문 보기
          </Text>
        </View>
      ) : (
        // Example view
        <View style={styles.exampleView}>
          <Text style={[styles.exampleText, { color: theme.textColor }]}>
            {item.example}
          </Text>
          {selectedLanguage !== 'korean' && (
            <View style={styles.translationsContainer}>
              <Text style={[styles.translationText, { color: theme.textColor }]}>
                {item.translations[selectedLanguage]}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.speakButton}
            onPress={() => speakText(item.example)}
          >
            <Ionicons name="volume-high" size={20} color={theme.primaryButtonColor} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const GrammarSection = ({ navigation }) => {
  const [showGrammar, setShowGrammar] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('korean');
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const theme = {
    backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
    textColor: isDarkMode ? '#FFFFFF' : '#000000',
    cardBackground: isDarkMode ? '#222' : 'white',
    primaryButtonColor: isDarkMode ? '#1a6bb8' : '#2196F3',
    modalBackground: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
    modalContentBackground: isDarkMode ? '#333' : '#fff',
    cardShadow: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)',
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
    setShowLanguageModal(false);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setShowLanguageModal(false);
    setShowGrammar(true);
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

  if (!showGrammar) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <View style={styles.centerContainer}>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => setShowLanguageModal(true)}
          >
            <Ionicons name="book" size={50} color={theme.textColor} />
            <Text style={[styles.text, { color: theme.textColor, marginTop: 10 }]}>
              문법 학습 시작하기
            </Text>
          </TouchableOpacity>
        </View>

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
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {grammarExamples.map((item, index) => (
          <GrammarCard
            key={index}
            item={item}
            selectedLanguage={selectedLanguage}
            theme={theme}
            speakText={speakText}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    padding: isIPad ? 20 : 10,
    paddingTop: 20,
    paddingBottom: 40,
  },
  grammarCard: {
    width: '100%',
    borderRadius: 15,
    marginBottom: 20,
    padding: isIPad ? 20 : 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  grammarView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    minHeight: isIPad ? 150 : 100,
  },
  exampleView: {
    padding: 10,
    minHeight: isIPad ? 150 : 100,
  },
  exampleContentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  exampleTextContainer: {
    flex: 1,
    paddingRight: 15,
  },
  grammarText: {
    fontSize: isIPad ? 36 : 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  meaningText: {
    fontSize: isIPad ? 28 : 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  tapInstruction: {
    fontSize: isIPad ? 16 : 12,
    color: '#888',
    marginTop: 10,
  },
  exampleText: {
    fontSize: isIPad ? 32 : 22,
    textAlign: 'left',
    lineHeight: isIPad ? 48 : 32,
    marginBottom: 15,
  },
  translationsContainer: {
    width: '100%',
    paddingVertical: 10,
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  translationText: {
    fontSize: isIPad ? 24 : 16,
    lineHeight: isIPad ? 36 : 24,
    textAlign: 'left',
  },
  speakButton: {
    padding: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'flex-start',
  },
  // Previous styles from original component
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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