// AddQuestion.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import Parse from 'parse/react-native';

const AddQuestion = ({ navigation }) => {
  const [question, setQuestionText] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');

  const handleAddQuestion = async () => {
    const Question = Parse.Object.extend('Question');
    const newQuestion = new Question();
    newQuestion.set('question', question);
    newQuestion.set('correctAnswer', correctAnswer);

    try {
      await newQuestion.save();
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Question</Text>
      <TextInput
        style={styles.input}
        placeholder="Question"
        value={question}
        onChangeText={(text) => setQuestionText(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Correct Answer"
        value={correctAnswer}
        onChangeText={(text) => setCorrectAnswer(text)}
      />
      <Button title="Add Question" onPress={handleAddQuestion} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
});

export default AddQuestion;
