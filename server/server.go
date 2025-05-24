package server

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type Server struct {
	rooms    map[string]Room
	upgrader websocket.Upgrader
}

func NewServer() Server {
	return Server{
		rooms: map[string]Room{},
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
		},
	}
}

func (s *Server) OpenRoom() string {
	for {
		roomUid := uuid.New().String()
		if _, ok := s.rooms[roomUid]; !ok {
			s.rooms[roomUid] = Room{}
			return roomUid
		}
		return roomUid
	}
}

func (s *Server) ServerWS(w http.ResponseWriter, r http.Request) {
	s.upgrader.Upgrade(w, &r, r.Header)
}
