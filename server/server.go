package server

import (
	"fmt"
	"net/http"

	"github.com/Wlczak/tanks/logger"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type Server struct {
	rooms    map[string]Room
	players  map[string]Player
	upgrader websocket.Upgrader
}

func NewServer() Server {
	return Server{
		rooms:   map[string]Room{},
		players: map[string]Player{},
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
		},
	}
}

func (s *Server) OpenRoom() string {
	for i := 0; i < 1000; i++ {
		roomUid := uuid.New().String()
		if _, ok := s.rooms[roomUid]; !ok {
			s.rooms[roomUid] = Room{RID: roomUid}
			return roomUid
		}
	}
	return ""
}

func (s *Server) JoinRoom(roomId string, player Player) {
	if _, ok := s.players[player.UID]; !ok {
		loggedInPlayer := s.players[player.UID]
		s.rooms[roomId].Players[player.UID] = &loggedInPlayer
	}
}

func (s *Server) ServerWS(w http.ResponseWriter, r http.Request) {
	zap := logger.GetLogger()

	conn, err := s.upgrader.Upgrade(w, &r, nil)
	if err != nil {
		zap := logger.GetLogger()
		zap.Error(err.Error())
		_, err := w.Write([]byte(err.Error()))

		if err != nil {
			zap := logger.GetLogger()
			zap.Error(err.Error())
		}
	}

	player := Player{
		UID:      uuid.New().String(),
		Username: "",
	}

	conn.WriteJSON(player)

	for player.Username == "" {
		fromClient := Player{}
		err := conn.ReadJSON(&fromClient)
		if err != nil {
			zap := logger.GetLogger()
			zap.Error(err.Error())
			conn.Close()
			return
		}
		if fromClient.UID == player.UID {
			player = fromClient
		} else {
			zap.Warn("client provided missmatched id")
		}
	}

	s.players[player.UID] = player

	zap.Info(fmt.Sprintf("Username: %s", player.Username))

	for {
		_, msg, err := conn.ReadMessage()

		if err != nil {
			zap := logger.GetLogger()
			zap.Error(err.Error())
			conn.Close()
			return
		}

		err = conn.WriteMessage(websocket.TextMessage, []byte(msg))
	}
}
