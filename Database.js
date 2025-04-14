import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'quizProgress.db', location: 'default' },
  () => {},
  (err) => { console.log('SQLite Error: ', err); }
);

// Function to initialize the database and create the table if it doesn't exist
const initializeDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS progress (id INTEGER PRIMARY KEY AUTOINCREMENT, questionIndex INTEGER);',
      [],
      () => console.log('Table created or exists'),
      (err) => console.log('Error creating table: ', err)
    );
  });
};

// Save the progress of the quiz (question index)
export const saveProgress = (questionIndex) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT OR REPLACE INTO progress (id, questionIndex) VALUES (1, ?);',
      [questionIndex],
      () => console.log('Progress saved'),
      (err) => console.log('Error saving progress:', err)
    );
  });
};

// Retrieve the saved progress
export const getProgress = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM progress WHERE id = 1;',
      [],
      (tx, results) => {
        const progress = results.rows.length > 0 ? results.rows.item(0).questionIndex : 0;
        callback(progress);
      },
      (err) => console.log('Error fetching progress:', err)
    );
  });
};

// Call this function once when your app starts or when you initialize the app
initializeDatabase();
