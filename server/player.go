package server

import "github.com/gorilla/websocket"

type Player struct {
	UID      string
	Username string
	Conn     *websocket.Conn
}
