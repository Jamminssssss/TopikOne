import AsyncStorage from '@react-native-async-storage/async-storage';

// Save quiz progress (current question index and selected answer)
export const saveProgress = async (currentQuestionIndex, selectedAnswer) => {
  try {
    await AsyncStorage.setItem('quizProgress', JSON.stringify({ currentQuestionIndex, selectedAnswer }));
  } catch (error) {
    console.error('Error saving progress', error);
  }
};

// Get quiz progress (returns the stored progress or default if not found)
export const getProgress = async () => {
  try {
    const savedProgress = await AsyncStorage.getItem('quizProgress');
    if (savedProgress) {
      return JSON.parse(savedProgress);
    }
    return { currentQuestionIndex: 0, selectedAnswer: null }; // Default values
  } catch (error) {
    console.error('Error loading progress', error);
    return { currentQuestionIndex: 0, selectedAnswer: null }; // Default values
  }
};
