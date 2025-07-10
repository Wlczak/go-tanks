package routes

import (
	"net/http"

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
		c.JSON(http.StatusOK, json.OpenRoom{RoomId: roomName})
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
