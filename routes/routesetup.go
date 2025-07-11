package routes

import (
	"net/http"

	"github.com/Wlczak/tanks/logger"
	"github.com/Wlczak/tanks/routes/api/json"
	"github.com/Wlczak/tanks/server"
	"github.com/gin-gonic/gin"
)

func SetupRouter(srv server.Server) *gin.Engine {

	// Disable Console Color
	// gin.DisableConsoleColor()
	gin.SetMode(gin.DebugMode)

	r := gin.Default()

	r.Use(gin.CustomRecovery(func(c *gin.Context, err any) {
		c.HTML(http.StatusInternalServerError, "error.tmpl", gin.H{
			"error": err,
		})
	}))

	apiG := r.Group("/api")

	apiG.GET("/openRoom", func(c *gin.Context) {
		roomName := srv.OpenRoom()
		if roomName != "" {
			c.JSON(http.StatusOK, json.OpenRoom{RoomId: roomName})
		} else {
			c.JSON(http.StatusInternalServerError, json.OpenRoom{RoomId: ""})
		}
	})

	apiG.POST("/joinRoom", func(c *gin.Context) {
		zap := logger.GetLogger()

		var req json.JoinRoomRequest
		if err := c.BindJSON(&req); err != nil || req.UID == "" || req.RoomId == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		err := srv.JoinRoom(req.RoomId, req.UID)

		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			zap.Error(err.Error())
		} else {
			c.JSON(http.StatusOK, json.JoinRoomRequest{UID: req.UID, RoomId: req.RoomId})
		}
	})

	r.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusPermanentRedirect, "/game")
	})

	r.Any("/server", func(c *gin.Context) {
		srv.ServerWS(c.Writer, *c.Request)
	})
	r.LoadHTMLGlob("templates/*")
	r.GET("/wstest", func(c *gin.Context) {
		c.HTML(http.StatusOK, "wstest.tmpl", nil)
	})

	r.StaticFS("/game", http.Dir("game"))

	return r
}
