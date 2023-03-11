# Memo
- https://www.ohitori.fun/entry/graphql-subscription-in-go を参考にした。
- GraphQLのスキーマは、[こちら](https://github.com/sanoyo/ultrachat/tree/main/schema)を使用
- serverコードの生成は、[gqlgen](https://github.com/99designs/gqlgen)を利用
  - WSL環境でコード編集・実行

# Usage
1. GraphQL server起動
    ```console
    $ go run server.go
    ```

1. ブラウザ1で、`http://localhost:8080/` 接続し、以下を入力し実行
    ```json
    subscription {
        messageSent {
            id
            message
            createdAt
        }
    }
    ```

1. ブラウザ2で、``http://localhost:8080/` 接続し、以下を入力し実行`

    ```json
    mutation($text: String!) {
        sendMessage(message: $text) {
            id
            message
            createdAt
        }
    }
    ```

    - Variables
    ```json
    {
        "text": "Hellwww!!!!!"
    }
    ```
1. ブラウザ1に、2で入力したメッセージが表示される

# ref
- GraphQL/gplgen/subscribe(local動作確認用)
  - [複雑でない実装](https://www.ohitori.fun/entry/graphql-subscription-in-go)
  - [Redis使った本格派](https://kaminashi-developer.hatenablog.jp/entry/2020/12/11/093000)
- AppSync/GraphQL(Subscription)/apolo-clientなどについて
  - https://github.com/sanoyo/ultrachat/discussions/4#discussioncomment-5274101
