import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, Alert } from 'react-native';

export default function App() {
  const [text, onChangeText] = React.useState('Please input text here!!!');
  const [response, setResponse] = React.useState('');

  // https://qiita.com/_ytori/items/a92d69760e8e8a2047ac が実用的そう
  React.useEffect(() => {
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
  
          console.log('これ以降、他クライアントがpostしたメッセージをsubscription経由で受信できる');
          // websocket.onmessage = function (event) {
          //   console.log('Received:', JSON.parse(event.data));
          // }
          const onMessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received:', data);
            setResponse(prev => [...prev, data.payload.data.messageSent.message+'\n']);
          }
          websocket.addEventListener('message', onMessage);

          return () => {
            websocket.close();
            websocket.removeEventListener('message', onMessage);
          }
        }
      }
    }
  },[])

  const handleSubmit = () => {
    fetch("http://localhost:8080/query", {
      "headers": {
        "content-type": "application/json",
      },
      "body": `{\"query\":\"mutation($text: String!) {\\n  sendMessage(message: $text) {\\n    id\\n    message\\n    createdAt\\n  }\\n}\",\"variables\":{\"text\":\"${text}\"}}`,
      "method": "POST",
      "mode": "cors",
      "credentials": "omit"
    });
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
          title="POST!"
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
