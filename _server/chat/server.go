package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/ddddddO/ultrachat-front/_server/chat/graph"
	"github.com/go-chi/chi"
	"github.com/gorilla/websocket"
	"github.com/rs/cors"
)

const defaultPort = "8080"

// ref: https://gqlgen.com/recipes/cors/
func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	router := chi.NewRouter()

	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:19006"},
		AllowCredentials: true,
		Debug:            true,
	}).Handler)

	srv := handler.New(
		graph.NewExecutableSchema(graph.Config{Resolvers: graph.NewResolver()}),
	)
	srv.AddTransport(&transport.Websocket{
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				// Check against your desired domains here
				log.Printf("In HOST: %s\n", r.Host)
				return r.Host == "localhost:8080"
			},
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
		},
	})
	// https://vallettaio.hatenablog.com/entry/2020/05/10/024551
	// https://github.com/99designs/gqlgen/blob/622039cb5042631cda3195a4838359e156775e2d/graphql/handler/server.go#L31-L50 のあたり参考に追加
	srv.AddTransport(&transport.Options{})
	srv.AddTransport(&transport.GET{})
	srv.AddTransport(&transport.POST{})
	srv.AddTransport(&transport.MultipartForm{})
	srv.SetQueryCache(lru.New(1000))
	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New(100),
	})

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
