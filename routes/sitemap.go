package routes

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/ikeikeikeike/go-sitemap-generator/v2/stm"
)

func genSiteMap(c *gin.Context) {
	sitemap := stm.NewSitemap(1)
	sitemap.Create()

	sitemap.SetDefaultHost(os.Getenv("DOMAIN"))

	sitemap.Add(stm.URL{
		{"loc", "/game/"},
		{"changefreq", "monthly"},
		{"priority", "1.0"},
	})

	xml := sitemap.XMLContent()

	c.Header("Content-Type", "application/xml")
	c.String(http.StatusOK, string(xml))
}
