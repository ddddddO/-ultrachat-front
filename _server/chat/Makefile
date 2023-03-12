# schema.graphqlsを書き換えたら以下を実行.
gen:
	go run github.com/99designs/gqlgen generate

# 何か変わって取得できなくても、chromeのdeveloper toolからcurlクエリコピーできるから、ブラウザで実行してみてみる
query:
	curl -X POST 'http://localhost:8080/query' \
		-H 'content-type: application/json' \
		--data-raw '{"query":"query {\n  getChatMessages {\n    id\n    message\n    createdAt\n  }\n}"}' \
		| jq .

# うまくいかない. shではうまくいく
# mutation:
# 	curl 'http://localhost:8080/query' -H 'content-type: application/json' --data-raw $'{"query":"mutation($text: String\u0021) {\\n  sendMessage(message: $text) {\\n    id\\n    message\\n    createdAt\\n  }\\n}","variables":{"text":"Good night"}}' | jq .
