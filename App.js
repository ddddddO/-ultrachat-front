import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, Alert } from 'react-native';

export default function App() {
  const [text, onChangeText] = React.useState('Please input text here!!!');
  const [response, setResponse] = React.useState('');

  const websocket = new WebSocket('ws://localhost:8080/query', 'graphql-transport-ws');
  websocket.onopen = function (event) {
    console.log('この時点でWebSocketのコネクションは確立.以下で、GraphQL側とのハンドシェイク開始');
    websocket.send('{"type":"connection_init","payload":{}}');

    websocket.onmessage = function (event) {
      console.log('GraphQL側からackを受けとる');
      const connectionAck = JSON.parse(event.data);
      if (connectionAck && connectionAck.type === 'connection_ack') {
        console.log('ack確認後、以下で何をsubscribeしたいかをGraphQL側に通知(idは決め打ちしちゃってる。GraphQL用のクライアントライブラリ使った方がいいのかな)');

        const subscription = {
          id: "755f3598-629d-4058-9f90-1dc665db7316",
          payload: {
            query: 'subscription {\n  messageSent {\n    id\n    message\n    createdAt\n  }\n}',
          },
          type: 'subscribe',
        };
        websocket.send(JSON.stringify(subscription));

        console.log('これ以降、他クライアントがpostしたメッセージをsubscription経由で受信できる.後はどうにかUIに描画する実装をすればOKそう');
        websocket.onmessage = function (event) {
          console.log('Received:', JSON.parse(event.data));
        }
      }
    }
  }

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
