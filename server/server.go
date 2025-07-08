package server

import (
	"fmt"
	"net/http"
	"time"

	"github.com/Wlczak/tanks/logger"
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
		//return roomUid
	}
}

func (s *Server) ServerWS(w http.ResponseWriter, r http.Request) {
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
	// conn.WriteJSON(gin.H{
	// 	"roomId": s.OpenRoom(),
	// })
	// type Read struct {
	// 	roomId string `json:"roomId"`
	// }
	time.Sleep(time.Second * 5)

	_, msg, err := conn.ReadMessage()
	if err != nil {
		zap := logger.GetLogger()
		zap.Error(err.Error())
	}
	zap := logger.GetLogger()
	zap.Info(fmt.Sprintf("Message: %s", msg))
}
