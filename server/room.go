package server

type Room struct {
	RID     string
	Players map[string]*Player
}
