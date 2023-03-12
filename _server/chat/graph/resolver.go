package graph

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

import (
	"sync"

	"github.com/ddddddO/ultrachat-front/_server/chat/graph/model"
)

type Resolver struct {
	subscribers map[string]chan<- *model.ChatMessage
	messages    []*model.ChatMessage
	mutex       sync.Mutex
}

func NewResolver() *Resolver {
	return &Resolver{
		subscribers: map[string]chan<- *model.ChatMessage{},
		mutex:       sync.Mutex{},
	}
}
