package json

type OpenRoom struct {
	RoomId string `json:"roomId"`
}

type JoinRoomRequest struct {
	UID    string `json:"uid"`
	RoomId string `json:"roomId"`
}
