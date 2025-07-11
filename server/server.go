package server

import (
	"fmt"
	"net/http"

	"github.com/Wlczak/tanks/logger"
	"github.com/Wlczak/tanks/routes/api/json"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type Server struct {
	rooms    map[string]Room
	players  map[string]*Player
	upgrader websocket.Upgrader
}

func NewServer() Server {
	return Server{
		rooms:   map[string]Room{},
		players: map[string]*Player{},
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
			s.rooms[roomUid] = Room{RID: roomUid, Players: map[string]*Player{}}
			return roomUid
		}
	}
	return ""
}

func (s *Server) JoinRoom(roomId string, uid string) error {
	if _, ok := s.players[uid]; !ok {
		return fmt.Errorf("player not logged in")
	}

	if _, ok := s.rooms[roomId]; !ok {
		return fmt.Errorf("room not found")
	}

	if _, ok := s.rooms[roomId].Players[uid]; !ok {
		loggedInPlayer := s.players[uid]
		zap := logger.GetLogger()
		zap.Info(fmt.Sprintf("player %s, with uid %s joined room %s", loggedInPlayer.Username, loggedInPlayer.UID, roomId))
		if loggedInPlayer.Conn != nil {
			zap.Info("player conn not nil")
		} else {
			zap.Info("player conn nil")
		}
		s.rooms[roomId].Players[uid] = loggedInPlayer
		err := loggedInPlayer.Conn.WriteJSON(gin.H{
			"roomId": roomId,
		})
		if err != nil {
			return err
		}
	} else {
		return fmt.Errorf("player already in room")
	}
	return nil
}

func (s *Server) ServerWS(w http.ResponseWriter, r http.Request) {
	zap := logger.GetLogger()

	conn, err := s.upgrader.Upgrade(w, &r, nil)
	if err != nil {
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
		Conn:     conn,
	}

	err = conn.WriteJSON(json.Player{
		UID:      player.UID,
		Username: player.Username,
	})

	if err != nil {
		zap.Error(err.Error())
		err = conn.Close()
		if err != nil {
			zap.Error(err.Error())
		}
		return
	}

	for player.Username == "" {
		fromClient := Player{}
		err := conn.ReadJSON(&fromClient)
		if err != nil {
			zap.Error(err.Error())
			err = conn.Close()
			if err != nil {
				zap.Error(err.Error())
			}
			return
		}
		if fromClient.UID == player.UID {
			player.Username = fromClient.Username
		} else {
			zap.Warn("client provided missmatched id")
		}
	}
	s.players[player.UID] = &player

	zap.Info(fmt.Sprintf("Username: %s", player.Username))

	for {
		_, msg, err := conn.ReadMessage()

		if err != nil {
			zap.Error(err.Error())
			err = conn.Close()
			if err != nil {
				zap.Error(err.Error())
			}
			return
		}

		err = conn.WriteMessage(websocket.TextMessage, []byte(msg))

		if err != nil {
			zap.Error(err.Error())
			err = conn.Close()
			if err != nil {
				zap.Error(err.Error())
			}
			return
		}
	}
}
