import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, Alert } from 'react-native';

export default function App() {
  const [text, onChangeText] = React.useState('Please input text here!!!');
  const [response, setResponse] = React.useState('');

  const handleSubmit = () => {
    Alert.alert('Send text!:', text);

    let res = response + '\n' + text + 'by server';
    setResponse(res);
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!!!!</Text>
      <SafeAreaView>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
        />
        <Button
          title="Press me"
          color="#f194ff"
          onPress={handleSubmit}
        />
      </SafeAreaView>
      <Text>
        {response}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
